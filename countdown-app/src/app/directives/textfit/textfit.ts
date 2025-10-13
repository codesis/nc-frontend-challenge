import { Directive, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList } from '@angular/core'

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
      this.resizeObserver = new ResizeObserver(() => this.resize())
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

  public resize() {
    const parent = this.el.parentElement
    if (!parent) return

    const parentWidth = parent.clientWidth

    let fontSize = 2000
    this.el.style.whiteSpace = 'nowrap'
    this.el.style.fontSize = fontSize + 'px'

    while (this.el.scrollWidth < parentWidth) {
      fontSize++
      this.el.style.fontSize = fontSize + 'px'
      if (fontSize > 10000) break
    }

    while (this.el.scrollWidth > parentWidth) {
      fontSize--
      this.el.style.fontSize = fontSize + 'px'
      if (fontSize <= 0) break
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()
    if (this.isBrowser()) {
      window.removeEventListener('resize', this.fitTextBound)
    }
  }
}
