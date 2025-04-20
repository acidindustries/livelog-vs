import * as vscode from 'vscode';
import { LivelogViewProvider } from './viewprovider';
import { StorageProvider } from './storage';
import { Backend } from './backend';

export function activate(context: vscode.ExtensionContext) {
	const provider = new LivelogViewProvider(context, new StorageProvider(context));
	const backend = new Backend(provider);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider('livelogSidebarView', provider));
	context.subscriptions.push({ dispose: () => backend.destroy() });
}

// This method is called when your extension is deactivated
export function deactivate() {
}
