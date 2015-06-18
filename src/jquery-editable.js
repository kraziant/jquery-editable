/* ===================================================
 *  jquery-editable.js v0.0.1
 *  https://github.com/kraziant/jquery-editable
 * ===================================================
 *  Copyright (c) 2015 Kuzyakin Anton
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ========================================================== */

(function( $ ){
  /**
   * .editable(config)
   * 
   * Расширение библиотеки jQuery создающее поле для ввода на месте
   * целевого элемента.
   * 
   * $('.editable').editable({
   *    delete_empty: true,
   *    editor: null,
   *    after_save: function () {},
   *    after_cancel: function () {},
   *    before_save: function () {},
   *    before_cancel: function () {}
   * });
   */
  $.fn.editable = function(config) {
  
    // нет необходимости писать $(this), так как "this" - это уже объект jQuery
    // выражение $(this) будет эквивалентно $($('#element'));
    if (!config) {
        /**
         * delete_empty - true|false - удалять пустые
         * editor - object with select(), blur(), focus() - редаткор на замену стандартному
         * after_save - callback перед сохранением
         * after_cancel - callback перед отменой
         * before_save - callback после сохранением
         * before_cancel - callback после сохранением
         */
        config = {
            delete_empty: true,
            editor: null,
            after_save: function (el) {},
            after_cancel: function (el) {},
            before_save: function (el) {},
            before_cancel: function (el) {}
        };
    }
    
    this.each(function () { 
        $(this).click(function () {
            /** 
             * Если нажать на элемент, он будет скрыт,
             * после него в DOM будет создан input с классом 
             * inline-editor, в который будет скопирован текст 
             * элемента, input получит фокус и выделит свое содержимое
             */
            var src = $(this);
            var editor = null;
            
            if (!config.editor) {
                editor = $('<input>')
                    .addClass('inline-editor')
                    .val(src.text());
            } else {
                editor = config.editor;                
            }
            
            /** Показать редаткор */
            function showEditor(){
                src.hide().after(editor);
                editor.focus().select();    
            }
            
            /** Убрать редактор */ 
            function hideEditor(){
                editor.remove();
                src.show();
            }
            
            showEditor();         
                
            /** Сохранение результатов ввода */
            editor.save = function(){
                
                var new_val = null;
                console.log(editor.val());
                
                if (editor.val() != '') {
                    new_val = editor.val();
                } else {
                    editor.cancel();
                }
            
                if (config.before_save){
                    config.before_save($(this));
                }
                
                src.val(new_val).change();
                src.text(new_val);
                
                hideEditor();
                
                if (config.after_save) {
                    config.after_save(src);
                }
                
                
            };
            
            /** Отмена ввода */
            editor.cancel = function() {
               hideEditor();  
               if (config.after_cancel){
                   config.after_cancel(src);
               }

               if (config.delete_empty){
                   console.log('delete');
                   if(src.text() == '') {
                       src.remove();
                   }
               }
            };
            
            /** Поведение при нажатии Enter или Esc */
            editor.keyup(function ( e ) {
                if ( e.keyCode == 13 /* Enter */) {
                    editor.save();
                }
                if ( e.keyCode == 27 /* Esc */) {
                    editor.cancel();
                }
            });
            
            editor.blur(function () {
                editor.cancel();
            });
        });
    });
    
    
    return this;

  };
})( jQuery );