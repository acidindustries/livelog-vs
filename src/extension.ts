import * as vscode from 'vscode';
import { LivelogViewProvider } from './viewprovider';
import { StorageProvider } from './storage';
import { Backend } from './backend';

export function activate(context: vscode.ExtensionContext) {
	const provider = new LivelogViewProvider(context, new StorageProvider(context));
	const backend = new Backend(provider);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider('livelogSidebarView', provider));

	function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
		return {
			// Enable javascript in the webview
			enableScripts: true,

			// And restrict the webview to only loading content from our extension's `media` directory.
			localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
		};
	}

	console.log('Congratulations, your extension "livelog" is now active!');

	const disposable = vscode.commands.registerCommand('livelog.sendMessage', () => {
		provider.postJsonToWebView(
			{
				date: new Date().toString(),
				source: "",
				level: "warning",
				color: "default",
				buffer: 'buffer',
				payload_data: {
					type: 'message',
					message: 'Test'
				}
			}, false
		);

		vscode.window.showWarningMessage('Message from Livelog registered!');
	});

	const json = vscode.commands.registerCommand('livelog.sendJSON', () => {
		provider.postJsonToWebView(
			{
				date: new Date().toString(),
				source: "purple",
				level: "success",
				color: "purple",
				payload_data: {
					type: 'json',
					data: { test: 2 },
					pretty: false
				}
			}, false
		);

		vscode.window.showWarningMessage('JSON from Livelog registered!');
	});

	const spacer = vscode.commands.registerCommand('livelog.sendSpacer', () => {
		provider.postJsonToWebView(
			{
				date: new Date().toString(),
				source: "",
				level: "success",
				color: "purple",
				payload_data: {
					type: 'spacer',
				}
			}, false
		);

		vscode.window.showWarningMessage('Spacer from Livelog registered!');
	});

	const variable = vscode.commands.registerCommand('livelog.sendVariable', () => {
		provider.postJsonToWebView(
			{
				date: new Date().toString(),
				source: "purple",
				level: "success",
				color: "purple",
				payload_data: {
					type: 'variable',
					data: { test: 2 },
				}
			}, false
		);

		vscode.window.showWarningMessage('Variable from Livelog registered!');
	});

	context.subscriptions.push(disposable, json, spacer, variable);
	context.subscriptions.push({ dispose: () => backend.destroy() });
}

// This method is called when your extension is deactivated
export function deactivate() {
}
