import * as vscode from 'vscode';

export class StorageProvider {
    private readonly storageKey = 'livelogMessages';
    private messages: any[] = [];

    constructor(private readonly context: vscode.ExtensionContext) {
        this.loadMessages();
    }

    public addMessage(message: any) {
        this.messages.push(message);
        this.saveMessages();
    }

    public getMessages(): any[] {
        return this.messages;
    }

    public clearMessages() {
        this.messages = [];
        this.saveMessages();
    }

    public saveMessages() {
        this.context.globalState.update(this.storageKey, this.messages);
    }

    private loadMessages() {
        this.messages = this.context.globalState.get(this.storageKey, []);
        console.log(this.messages);
    }
}