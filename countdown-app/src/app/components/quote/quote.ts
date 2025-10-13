import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone,
  Output,
  EventEmitter,
  signal,
} from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-quote',
  standalone: true,
  templateUrl: './quote.html',
  imports: [CommonModule],
})
export class QuoteComponent implements OnInit {
  quote = signal('')
  loading = signal(true)
  @Output() quoteReady = new EventEmitter<void>()

  constructor(
    private cd: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    fetch('https://dummyjson.com/quotes/random')
      .then((res) => res.json())
      .then((data: any) => {
        this.zone.run(() => {
          this.quote.set(data?.quote)
          this.loading.set(false)
          this.cd.detectChanges()
          this.quoteReady.emit()
        })
      })
      .catch(() => {
        this.quote.set('Quote unavailable')
        this.cd.detectChanges()
        this.loading.set(false)
        this.quoteReady.emit()
      })
  }
}
