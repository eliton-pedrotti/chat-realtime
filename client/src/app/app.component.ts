import { Component, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { SocketIoService } from './socket-io.service'
import { Message } from './message';
import { Subscription } from 'rxjs'
import { MatListItem } from '@angular/material/list';
import { MatList } from '@angular/material/list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  nickname: string
  message: string
  messages: Message[] = []
  private subscriptionMessages: Subscription
  private subscriptionList: Subscription

  @ViewChild(MatList, {read: ElementRef, static: true}) list: ElementRef
  @ViewChildren(MatListItem) listItems: QueryList<MatListItem>

  constructor(
    private socketService: SocketIoService){
  }

  ngOnInit(){
    this.subscriptionMessages = this.socketService.messages().subscribe((m: Message) => {
       console.log(m)
       this.messages.push(m)
      })
  }

  ngAfterViewInit(){ this.subscriptionList = 
    this.listItems.changes.subscribe((e) => {
      this.list.nativeElement.scrollTop =
      this.list.nativeElement.scrollHeight
    })
  }

  send(){
    this.socketService.send({
      from: this.nickname,
      message:  this.message
    })
    this.message = ''
  }
  ngOnDestroy(){
    this.subscriptionMessages.unsubscribe()
    this.subscriptionList.unsubscribe()
  }
}
