import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Message } from '../Entites/Message.Entites';
import { Chat } from '../Entites/Chat.Entites';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  baseUrl = "http://localhost:8081/api";

  constructor(private httpClient: HttpClient) { }


  updateChat(message: Message, chatId: any): Observable<Object> {
    return this.httpClient.put(this.baseUrl + "/chats/message/" + `${chatId}`, message);
  }

  getChatById(chatId: any) {
    return this.httpClient.get<Chat>(this.baseUrl + "/chats/" + chatId)
  }

  addMessageToChatRoom(message: Message): Observable<Object> {
    return this.httpClient.post(this.baseUrl + "/chats/add/message1", message);
  }

  getAllMessagesByChatId(chatId: any) {
    return this.httpClient.get<Message[]>(this.baseUrl + "/chats/all/messages/from/chat/" + chatId)
  }

  createChatRoom(chat: Chat): Observable<Object> {
    return this.httpClient.post(this.baseUrl + "/chats/add", chat);
  }

  getChatByFirstUserNameAndSecondUserName(emailfirstUserName: String, emailsecondUserName: String) {
    return this.httpClient.get<Chat>(this.baseUrl + "/chats/getChatByFirstUserNameAndSecondUserName" + '?emailfirstUserName=' + emailfirstUserName + '&emailSecondeUser=' + emailsecondUserName)
  }

  getChatByFirstUserNameOrSecondUserName(username: any) {
    return this.httpClient.get<Chat>(this.baseUrl + "/chats/getChatByFirstUserNameOrSecondUserName/" + username)
  }

}
