import {
  AfterViewInit,
  Component,
  OnDestroy,
  NgZone,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { InputComponent } from '../input/input'
import { QuoteComponent } from '../quote/quote'
import { TextFitDirective } from '../../directives/textfit/textfit'
import { LocalStorageService } from '../../services/localstorage.service'

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.html',
  styleUrls: ['./countdown.scss'],
  standalone: true,
  imports: [InputComponent, QuoteComponent, FormsModule, TextFitDirective],
})
export class CountdownComponent implements AfterViewInit, OnDestroy {
  constructor(
    private zone: NgZone,
    private localStorageService: LocalStorageService,
  ) {}
  @ViewChild('countdown', { static: true })
  countdownElement!: ElementRef<HTMLElement>
  title = signal('')
  date = signal('')
  timeLeft = signal('')
  diff = signal(0)
  private _timer?: ReturnType<typeof setInterval>
  private _savedTitleKey = 'countdownTitle'
  private _savedDateKey = 'countdownDate'

  ngAfterViewInit() {
    const dateSaved = this.localStorageService.getItem(this._savedDateKey)
    if (dateSaved) {
      this.date.set(dateSaved)
    }
    const titleSaved = this.localStorageService.getItem(this._savedTitleKey)
    if (titleSaved) {
      this.title.set(titleSaved)
    }
    setInterval(() => {
      if (!this.date()) return
      const target = new Date(this.date())
      const now = new Date()
      this.diff.set(target.getTime() - now.getTime())
      this.updateCountdown()
    }, 1000)
  }

  get minDate(): string {
    const tomorrow = new Date(Date.now() + 86400000)
    return tomorrow.toISOString().split('T')[0]
  }

  onDateChange() {
    if (this._timer) clearInterval(this._timer)
    if (!this.date) {
      this.timeLeft.set('')
      return
    }
    this._timer = setInterval(() => {
      this.zone.run(() => {
        this.updateCountdown()
      })
    }, 1000)
    this.localStorageService.setItem(this._savedDateKey, this.date())
  }

  ngOnDestroy() {
    if (this._timer) clearInterval(this._timer)
  }

  onTitleChange(value: string) {
    this.title.set(value)
    this.localStorageService.setItem(this._savedTitleKey, this.title())
  }

  updateCountdown() {
    const days = Math.floor(this.diff() / (1000 * 60 * 60 * 24))
    const hours = Math.floor((this.diff() / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((this.diff() / (1000 * 60)) % 60)
    const seconds = Math.floor((this.diff() / 1000) % 60)
    const daysText = days === 1 ? 'day' : 'days'
    this.countdownElement.nativeElement.innerText = `${days} ${daysText}, ${hours} h, ${minutes}m, ${seconds}s`
  }
}
