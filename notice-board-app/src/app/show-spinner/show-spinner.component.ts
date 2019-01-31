import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-show-spinner',
  templateUrl: './show-spinner.component.html',
  styleUrls: ['./show-spinner.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShowSpinnerComponent implements OnInit {
  public editor;
  toolbarOptions = [['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']];
  public editorContent = `<h3>I am Example 03</h3>`;
  input;
  public editorConfig = {
    placeholder: "输入公告内容，支持html",
    modules: {
      toolbar: this.toolbarOptions
    },
    theme: 'snow'
  };

  constructor(private spn: NgxSpinnerService) { }

  onEditorBlured(quill) {
    // console.log('editor blur!', quill);
  }

  onEditorFocused(quill) {
    // console.log('editor focus!', quill);
  }

  onEditorCreated(quill) {
    this.editor = quill;
    // console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    this.input = html;

    // console.log('quill content is changed!', quill, html, text);
  }

  customButtonClick() {
    alert(`You can custom the button and listen click event to do something...\n你可以定义一些自定义按钮做你想做的事，如上传图片至第三方存储...等等`)
  }
  ngOnInit() {
    this.spn.show();
  }

}
