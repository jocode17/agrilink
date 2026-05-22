import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'https://localhost:7070/api/messages';

  constructor(private http: HttpClient) {}

  // GET /api/messages/conversations
  getConversations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversations`);
  }

  // GET /api/messages/conversations/{conversationId}
  getMessages(conversationId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversations/${conversationId}`);
  }

  // POST /api/messages/conversations/{conversationId}
  sendMessage(conversationId: string, content: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/conversations/${conversationId}`, { content });
  }
}