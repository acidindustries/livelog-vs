import * as vscode from 'vscode';
import { StorageProvider } from './storage';
import path from 'path';
import fs from 'fs';

export class LivelogViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private isViewReady = false;
    private pendingMessages: any[] = [];

    constructor(private readonly context: vscode.ExtensionContext, private readonly storageProvider: StorageProvider) {
    }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): Thenable<void> | void {
        this._view = webviewView;
        this.isViewReady = true;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, 'src', 'media'),
                vscode.Uri.joinPath(this.context.extensionUri, 'src', 'views'),
                vscode.Uri.joinPath(this.context.extensionUri, 'src', 'scripts'),
            ]
        };

        this.pendingMessages.forEach((message) => {
            this.postJsonToWebView(message, false);
        });

        webviewView.onDidChangeVisibility(() => {
            this.storageProvider.saveMessages();
            if (webviewView.visible) {
                this._view?.webview.postMessage({ type: 'init', data: this.storageProvider.getMessages() })
                webviewView.webview.html = this.getHtmlContent(webviewView.webview);

            }
        });

        webviewView.webview.onDidReceiveMessage(async message => {
            if (message.command === 'clear') {
                this.storageProvider.clearMessages();
                this._view?.webview.postMessage({ type: 'clear' });
            }
        });

        webviewView.webview.html = this.getHtmlContent(webviewView.webview);
    }

    postJsonToWebView(message: any, init: boolean) {
        if (this.isViewReady && this._view) {
            if (!init) {
                this.storageProvider.addMessage(message);
            }
            this._view.webview.postMessage({ type: 'message', data: message });
            return;
        }
        this.pendingMessages.push(message);
    }

    private getHtmlContent(webview: vscode.Webview): string {
        const filePath = vscode.Uri.file(path.join(this.context.extensionPath, 'views', 'main.html'));
        const collapserUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'scripts', 'collapser.js'));
        let data = fs.readFileSync(filePath.fsPath, 'utf8');
        data = data.replace("{{collapser}}", collapserUri.toString());
        return data;
    }
}