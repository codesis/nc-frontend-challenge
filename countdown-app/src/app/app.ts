import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CountdownComponent } from './components/countdown/countdown'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CountdownComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
