import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare const SVG:any;

@Component({
  selector: 'app-slate',
  templateUrl: './slate.component.html',
  styleUrls: ['./slate.component.scss']
})
export class SlateComponent implements OnInit {
    @ViewChild('svgWrapper') svgWrapper: ElementRef;
    @ViewChild('svgElement') svgElement: ElementRef;

    rectangle: any = { x: 110, y: 150, width: 150, height: 100 }

    svgDimension = { width: '300', height: '200', viewBox: '0 0 30 20' }
    offset: any = { x: 0, y: 0 };
    selectedElement: any;
    transform: any;

    constructor() { }

    ngOnInit() {
        this.svgDimension.width = this.svgWrapper.nativeElement.getBoundingClientRect().width
        this.svgDimension.height = this.svgWrapper.nativeElement.getBoundingClientRect().height

        this.svgDimension.viewBox = '0 0 '+(this.svgDimension.width)+' '+(this.svgDimension.height)

        // const svg = SVG(this.svgWrapper.nativeElement);
        // svg.viewbox(this.svgDimension.viewBox)
        // let rect = svg.rect(100, 100).move(100, 50).fill('#f06')
        // rect.selectize().resize();
        // rect.draggable();
    }

    getMousePosition(event){
        var CTM = this.svgElement.nativeElement.getScreenCTM();
        return {
            x: (event.clientX - CTM.e) / CTM.a,
            y: (event.clientY - CTM.f) / CTM.d
        };
    }

    startDrag(event){
        if (event.target.classList.contains('draggable')) {
            this.selectedElement = event.target;

            // Get initial coordinate of mouse on screen.
            this.offset = this.getMousePosition(event);

            // Get all the transforms currently on this element
            let transforms = this.selectedElement.transform.baseVal;

            // Ensure the first transform is a translate transform
            if(transforms.length === 0 ||
            transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE){

                // Create an transform that translates by (0, 0)
                let translate = this.svgElement.nativeElement.createSVGTransform();
                translate.setTranslate(0, 0);

                // Add the translation to the front of the transforms list
                this.selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }

            /* Get initial translation amount.
             * Update offset with translation which is zero
             */
            this.transform = transforms.getItem(0);
            this.offset.x -= this.transform.matrix.e;
            this.offset.y -= this.transform.matrix.f;

            console.log('get started', this.offset)
        }
    }

    drag(event){
        if (this.selectedElement) {
            event.preventDefault();

            let coord = this.getMousePosition(event);

            // add or subtract number units element has been moved.
            this.transform.setTranslate(coord.x - this.offset.x, coord.y - this.offset.y);

            console.log('moving draggable', this.transform.matrix)
        }
    }

    endDrag(event){
        console.log('finish dragging', event)
        this.selectedElement = null;
    }

}
