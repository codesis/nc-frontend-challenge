import {
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  QueryList,
} from '@angular/core'

@Directive({
  selector: '[appTextFit]',
})
export class TextFitDirective implements AfterViewInit, OnDestroy {
  private el: HTMLElement
  private resizeObserver?: ResizeObserver
  private mutationObserver?: MutationObserver
  private debounceTimeout?: any
  @ViewChildren(TextFitDirective)
  textFitDirectives!: QueryList<TextFitDirective>

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
  }

  public debouncedFitText() {
    clearTimeout(this.debounceTimeout)
    this.debounceTimeout = setTimeout(() => {
      const scrollY = window.scrollY

      this.resize()

      window.scrollTo(0, scrollY)
    }, 50)
  }

  private resize() {
    const parentWidth = this.el.parentElement?.clientWidth
    if (!parentWidth) return

    this.el.style.whiteSpace = 'nowrap'

    let min = 1
    let max = 1000
    let fontSize = min

    while (min <= max) {
      const mid = Math.floor((min + max) / 2)
      this.el.style.fontSize = mid + 'px'

      const elWidth = this.el.scrollWidth

      if (elWidth > parentWidth) {
        max = mid - 1
      } else {
        fontSize = mid
        min = mid + 1
      }
    }

    this.el.style.fontSize = fontSize + 'px'
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()
  }
}
