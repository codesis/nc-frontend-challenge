import { Directive, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList, signal } from '@angular/core'

@Directive({
  selector: '[appTextFit]',
})
export class TextFitDirective implements AfterViewInit, OnDestroy {
  private el: HTMLElement
  private resizeObserver?: ResizeObserver
  private mutationObserver?: MutationObserver
  private fitTextBound = () => this.resize()
  private debounceTimeout?: any
  @ViewChildren(TextFitDirective) textFitDirectives!: QueryList<TextFitDirective>;

  constructor(private elementRef: ElementRef<HTMLElement>) {
    this.el = this.elementRef.nativeElement
  }

  ngAfterViewInit() {
    this.resize()

    const parent = this.el.parentElement
    if (parent && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => this.resize())
      })
      this.resizeObserver.observe(parent)
    }

    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() =>
        this.debouncedFitText(),
      )
      this.mutationObserver.observe(this.el, {
        childList: true,
        characterData: true,
        subtree: true,
      })
    }

    if (this.isBrowser()) {
      window.addEventListener('resize', this.debouncedFitText.bind(this))
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  public debouncedFitText() {
    if (!this.isBrowser()) return

    clearTimeout(this.debounceTimeout)
    this.debounceTimeout = setTimeout(() => {
      const scrollY = window.scrollY

      this.resize()

      window.scrollTo(0, scrollY)
    }, 50)
  }

  private resize() {
    const parentWidth = this.el.parentElement?.clientWidth;
    if (!parentWidth) return;

    this.el.style.whiteSpace = 'nowrap';

    let min = signal(1);
    let max = signal(1000);
    let fontSize = min();

    while (min() <= max()) {
      const mid = Math.floor((min() + max()) / 2);
      this.el.style.fontSize = mid + 'px';

      const elWidth = this.el.scrollWidth;

      if (elWidth > parentWidth) {
        max.set(mid - 1);
      } else {
        fontSize = mid;
        min.set(mid + 1);
      }
    }

    this.el.style.fontSize = fontSize + 'px';
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()
    if (this.isBrowser()) {
      window.removeEventListener('resize', this.fitTextBound)
    }
  }
}
