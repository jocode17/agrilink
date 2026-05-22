import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-farmer-messages',
  standalone: false,
  templateUrl: './farmer-messages.component.html',
  styleUrls: ['./farmer-messages.component.scss']
})
export class FarmerMessagesComponent implements OnInit {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  activeNav = 'messages';
  farmerName = '';
  sidebarCollapsed = false;

  conversations: any[] = [];
  messages: any[] = [];
  selectedConversation: any = null;
  newMessage = '';
  loadingConversations = true;
  loadingMessages = false;
  currentUserId = '';

  private apiUrl = 'https://localhost:7070/api/messages';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user: any = this.authService.currentUser;
    if (user) {
      this.farmerName = user.farmName || user.ownerName || user.email || 'Farmer';
      this.currentUserId = user.id || '';
    }
    this.loadConversations();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  loadConversations() {
    this.loadingConversations = true;
    this.http.get<any[]>(`${this.apiUrl}/conversations`).subscribe({
      next: (data) => {
        this.conversations = data || [];
        this.loadingConversations = false;
      },
      error: (err) => {
        console.error('Error loading conversations:', err);
        this.conversations = [];
        this.loadingConversations = false;
      }
    });
  }

  selectConversation(conv: any) {
    this.selectedConversation = conv;
    this.loadMessages(conv.id);
  }

  loadMessages(conversationId: string) {
    this.loadingMessages = true;
    this.http.get<any[]>(`${this.apiUrl}/conversations/${conversationId}`).subscribe({
      next: (data) => {
        this.messages = (data || []).map(msg => ({
          ...msg,
          isMine: msg.senderId === this.currentUserId
        }));
        this.loadingMessages = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.messages = [];
        this.loadingMessages = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    const content = this.newMessage.trim();
    this.newMessage = '';

    this.http.post<any>(`${this.apiUrl}/conversations/${this.selectedConversation.id}`, {
      content: content
    }).subscribe({
      next: (msg) => {
        msg.isMine = true;
        this.messages.push(msg);
        setTimeout(() => this.scrollToBottom(), 50);
      },
      error: (err) => console.error('Error sending message:', err)
    });
  }

  scrollToBottom() {
    try { this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' }); } catch (e) {}
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getContactName(conv: any): string {
    return conv.buyerName || conv.contactName || conv.otherPartyName || 'Buyer';
  }

  getContactInitial(conv: any): string {
    const name = this.getContactName(conv);
    return name.charAt(0).toUpperCase();
  }

  navigate(section: string) {
    this.activeNav = section;
    if (section === 'overview') {
      this.router.navigate(['/farmer/dashboard']);
    } else {
      this.router.navigate(['/farmer/' + section]);
    }
  }

  logout() {
    this.authService.logout();
  }
}