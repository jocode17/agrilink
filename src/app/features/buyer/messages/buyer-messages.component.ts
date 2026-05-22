import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-buyer-messages',
  standalone: false,
  templateUrl: './buyer-messages.component.html',
  styleUrls: ['./buyer-messages.component.scss']
})
export class BuyerMessagesComponent implements OnInit {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  activeNav = 'messages';
  buyerName = '';

  conversations: any[] = [];
  messages: any[] = [];
  selectedConversation: any = null;
  newMessage = '';
  loadingConversations = true;
  loadingMessages = false;
  currentUserId = '';

  // New chat
  showNewChat = false;
  farmers: any[] = [];

  private apiUrl = 'https://localhost:7070/api/messages';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user: any = this.authService.currentUser;
    if (user) {
      this.buyerName = user.contactName || user.businessName || user.email || 'Buyer';
      this.currentUserId = user.id || '';
    }
    this.loadConversations();
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

  openNewChat() {
    this.showNewChat = true;
    // Load available farmers to start a new conversation
    this.http.get<any[]>(`${this.apiUrl}/available-farmers`).subscribe({
      next: (data) => this.farmers = data || [],
      error: () => this.farmers = []
    });
  }

  startChatWithFarmer(farmer: any) {
    // Create a new conversation with this farmer via backend
    this.http.post<any>(`${this.apiUrl}/conversations/start`, {
      farmerId: farmer.id || farmer.userId || farmer.farmerId
    }).subscribe({
      next: (conv) => {
        this.showNewChat = false;
        this.selectedConversation = conv;
        this.messages = [];
        this.loadConversations(); // refresh list
      },
      error: (err) => {
        console.error('Error starting conversation:', err);
        this.showNewChat = false;
      }
    });
  }

  selectConversation(conv: any) {
    this.selectedConversation = conv;
    this.showNewChat = false;
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
    return conv.farmerName || conv.contactName || conv.otherPartyName || 'Farmer';
  }

  getContactInitial(conv: any): string {
    const name = this.getContactName(conv);
    return name.charAt(0).toUpperCase();
  }

  navigateBuyer(section: string) {
    this.activeNav = section;
    if (section === 'marketplace') {
      this.router.navigate(['/buyer/marketplace']);
    } else if (section === 'cart') {
      this.router.navigate(['/buyer/cart']);
    } else if (section === 'orders') {
      this.router.navigate(['/buyer/orders']);
    } else if (section === 'messages') {
      this.router.navigate(['/buyer/messages']);
    }
  }

  logout() {
    this.authService.logout();
  }
}