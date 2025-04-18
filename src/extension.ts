import * as vscode from 'vscode';
import { LivelogViewProvider } from './viewprovider';
import { StorageProvider } from './storage';
import { Backend } from './backend';

export function activate(context: vscode.ExtensionContext) {
	const provider = new LivelogViewProvider(context, new StorageProvider(context));
	const backend = new Backend(provider);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider('livelogSidebarView', provider));

	console.log('Congratulations, your extension "livelog" is now active!');

	const disposable = vscode.commands.registerCommand('livelog.helloWorld', () => {
		provider.postJsonToWebView(
			{
				level: "warning",
				color: "orange",
				message: {
					user: "admin",
					action: "login_attempt",
					status: "failed"
				}
			}, false
		);
		vscode.window.showInformationMessage('Hello World from livelog!');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push({ dispose: () => backend.destroy() });
}

// This method is called when your extension is deactivated
export function deactivate() {
}
