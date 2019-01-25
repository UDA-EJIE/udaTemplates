
// var selected = {};


// function clearDatatable(done) {
//     if ($('[id*="contextMenu"], [id*="context-menu"]').length > 0) {
//         $('.context-menu, .context-menu-active').rup_contextMenu('destroy');
//         $.contextMenu('destroy');
//     }
    
//     $('.dataTable').on('destroy.dt', () => {
//         $('#content').html('');
//         $('#content').nextAll().remove();
//         done();
//     });

//     if ($('.rup-feedback').length > 0) {
//         setTimeout(() => {
//             $('.dataTable').DataTable().destroy();
//         }, $('.dataTable').DataTable().settings().context[0].oInit.feedback.okFeedbackConfig.delay + 1);
//     } else {
//         $('.dataTable').DataTable().destroy();
//     }
// }
// function relacionMaestroDetalle(callback) {
//     let api = $('#example1').DataTable();
//     $('#example1').on('select.dt', (e, dt, type, indexes) => {
//         let data = api.rows(indexes).data();
//         selected.id = data.pluck('id')[0];
//         selected.nombre = data.pluck('nombre')[0];
//         selected.apellidos = data.pluck('apellidos')[0];
//         selected.edad = data.pluck('edad')[0];
//         $('#example2_filter_fieldset').find('#id_filter_table').val(selected.id);
//         $('#example2_filter_fieldset').find('#nombre_filter_table').val(selected.nombre);
//         $('#example2_filter_fieldset').find('#apellidos_filter_table').val(selected.apellidos);
//         $('#example2_filter_fieldset').find('#edad_filter_table').val(selected.edad);
//         $('#example2_filter_fieldset').find('#example2_filter_filterButton').click();
//         $('#example2_filter_fieldset').find('#nombre_filter_table').val('');
//         $('#example2_filter_fieldset').find('#apellidos_filter_table').val('');
//         $('#example2_filter_fieldset').find('#edad_filter_table').val('');

//     });
//     callback();
// }
// describe('Test Maestro-Detalle > ', () => {
//     beforeAll((done) => {
//         testutils.loadCss(done);
//     });

//     beforeEach((done) => {
//         //$.fn.dataTable.ext.errMode = 'throw';
//         dtGen.createDatatable1(1, () => {
//             dtGen.createDatatable2(() => {
//                 relacionMaestroDetalle(done);
//             });
//         });
//     });

//     afterEach((done) => {
//         setTimeout(() => {
//             clearDatatable(done);
//         },500);
//     });

//     describe('Creación > ', () => {
//         it('La datatable filtro debe contener elementos y la de resultados estar vacía:', () => {
//             expect($('#example1 > tbody > tr').length).toBe(5);
//             expect($('#example2 > tbody > tr').length).toBe(0);
//         });
//     });

//     describe('Filtrado intertabla > ', () => {
//         beforeEach((done) => {
//             $('#example2').on('draw.dt', () => {
//                 setTimeout(() => {
//                     done();
//                 }, 300);
//             });
//             $('#example1 > tbody > tr:eq(0) > td:eq(0)').click();
//         });
//         it('La fila seleccionada debe aparecer en la tabla de detalle:', () => {
//             expect($('#example2 > tbody > tr').length).toBe(1);
//             expect($('#example2 > tbody > tr:eq(0) > td:eq(1)').text()).toBe(selected.id);
//             expect($('#example2 > tbody > tr:eq(0) > td:eq(2)').text()).toBe(selected.nombre);
//             expect($('#example2 > tbody > tr:eq(0) > td:eq(3)').text()).toBe(selected.apellidos);
//             expect($('#example2 > tbody > tr:eq(0) > td:eq(4)').text()).toBe(selected.edad);
//         });
//     });
//     describe('Funcionamiento independiente > ', () => {
//         describe('Filtrado independiente > ', () => {
//             describe('Tabla maestro > ', () => {
//                 beforeEach((done) => {
//                     $('#example1').on('draw.dt', () => {
//                         setTimeout(() => {
//                             done();
//                         }, 500);
//                     });
//                     $('#example1_filter_fieldset').find('#id_filter_table').val(1);
//                     $('#example1_filter_fieldset').find('#example1_filter_filterButton').click();
//                 });
//                 it('Se debe de haber filtrado #example1:', () => {
//                     let ctx = $('#example1 > tbody > tr');
//                     expect(ctx.length).toBe(1);
//                     expect($('td:eq(1)', ctx).text()).toBe('1');
//                     expect($('td:eq(2)', ctx).text()).toBe('Ana');
//                     expect($('td:eq(3)', ctx).text()).toBe('García Vázquez');
//                     expect($('td:eq(4)', ctx).text()).toBe('7');
//                 });
//                 it('No debe haber cambios en #example2:', () => {
//                     let ctx = $('#example2 > tbody > tr');
//                     expect(ctx.length).toBe(0);
//                 });
//             });
//             describe('Tabla detalle > ', () => {
//                 beforeEach((done) => {
//                     $('#example2').on('draw.dt', () => {
//                         setTimeout(() => {
//                             done();
//                         }, 500);
//                     });
//                     $('#example2_filter_fieldset').find('#id_filter_table').val(1);
//                     $('#example2_filter_fieldset').find('#example2_filter_filterButton').click();
//                 });
//                 it('Se debe de haber filtrado #example2:', () => {
//                     let ctx = $('#example2 > tbody > tr');
//                     expect(ctx.length).toBe(1);
//                     expect($('td:eq(1)', ctx).text()).toBe('1');
//                     expect($('td:eq(2)', ctx).text()).toBe('Ana');
//                     expect($('td:eq(3)', ctx).text()).toBe('García Vázquez');
//                     expect($('td:eq(4)', ctx).text()).toBe('7');
//                 });
//                 it('No debe haber filtrado en #example1:', () => {
//                     let ctx = $('#example1 > tbody > tr');
//                     expect(ctx.length).toBe(5);
//                 });
//             });
//         });
//         describe('Búsqueda independiente > ', () => {
//             beforeEach((done) => {
//                 $('#example2').on('draw.dt', () => {
//                     setTimeout(() => {
//                         done();
//                     },300);
//                 });
//                 $('#example2_filter_fieldset').find('#example2_filter_filterButton').click();
//             });
//             describe('Tabla maestro > ', () => {
//                 beforeEach(() => {
//                     $('#searchCollapsLabel_example1').click();
//                 });
//                 describe('Aparición del seeker > ', () => {
//                     it('Se muestra el formulario de búsqueda en #example1:', () => {
//                         expect($('#example1').find('#id_seeker').is(':visible')).toBeTruthy();
//                         expect($('#example1').find('#nombre_seeker').is(':visible')).toBeTruthy();
//                         expect($('#example1').find('#apellidos_seeker').is(':visible')).toBeTruthy();
//                         expect($('#example1').find('#edad_seeker').is(':visible')).toBeTruthy();
//                     });
//                     it('No se debe mostrar el formulario de búsqueda en #example2', () => {
//                         expect($('#example2').find('#id_seeker').is(':visible')).toBeFalsy();
//                         expect($('#example2').find('#nombre_seeker').is(':visible')).toBeFalsy();
//                         expect($('#example2').find('#apellidos_seeker').is(':visible')).toBeFalsy();
//                         expect($('#example2').find('#edad_seeker').is(':visible')).toBeFalsy();
//                     });
//                 });
//                 describe('Funcionalidad del seeker > ', () => {
//                     beforeEach((done) => {
//                         $('#example1').find('#nombre_seeker').val('E');
//                         $('#search_nav_button_example1').click();
//                         $('#example1').on('tableSeekerSearchSucess', () => {
//                             setTimeout(() => {
//                                 done();
//                             },300);
//                         });
//                     });
//                     it('Se selecciona y marca el resultado de la selección: ', () => {
//                         let ctx = $('#example1').find('td:contains(4)').parent();
//                         expect($('td > span.ui-icon-search', ctx).length).toBe(1);

//                         ctx = $('#example1').find('td:contains(5)').parent();
//                         expect($('td > span.ui-icon-search', ctx).length).toBe(1);
//                     });
//                     it('No se selecciona nada en #example2:', () => {
//                         expect($('#example2 > tbody').find('span.ui-icon-search').length).toBe(0);
//                     });
//                 });
//             });
//             describe('Tabla detalle > ', () => {
//                 beforeEach(() => {
//                     $('#searchCollapsLabel_example2').click();
//                 });
//                 describe('Aparición del seeker > ', () => {
//                     it('Se muestra el formulario de búsqueda en #example2:', () => {
//                         expect($('#example2').find('#id_seeker').is(':visible')).toBeTruthy();
//                         expect($('#example2').find('#nombre_seeker').is(':visible')).toBeTruthy();
//                         expect($('#example2').find('#apellidos_seeker').is(':visible')).toBeTruthy();
//                         expect($('#example2').find('#edad_seeker').is(':visible')).toBeTruthy();
//                     });
//                     it('No se debe mostrar el formulario de búsqueda en #example2', () => {
//                         expect($('#example1').find('#id_seeker').is(':visible')).toBeFalsy();
//                         expect($('#example1').find('#nombre_seeker').is(':visible')).toBeFalsy();
//                         expect($('#example1').find('#apellidos_seeker').is(':visible')).toBeFalsy();
//                         expect($('#example1').find('#edad_seeker').is(':visible')).toBeFalsy();
//                     });
//                 });
//                 describe('Funcionalidad del seeker > ', () => {
//                     beforeEach((done) => {
//                         $('#example2').find('#nombre_seeker').val('E');
//                         $('#search_nav_button_example2').click();
//                         $('#example2').on('tableSeekerSearchSucess', () => {
//                             setTimeout(() => {
//                                 done();
//                             },300);
//                         });
//                     });
//                     it('Se selecciona y marca el resultado de la selección: ', () => {
//                         let ctx = $('#example2').find('td:contains(4)').parent();
//                         expect($('td > span.ui-icon-search', ctx).length).toBe(1);

//                         let ctx2 = $('#example2').find('td:contains(5)').parent();
//                         expect($('td > span.ui-icon-search', ctx2).length).toBe(1);
//                     });
//                     it('No se selecciona nada en #example1:', () => {
//                         expect($('#example1 > tbody').find('span.ui-icon-search').length).toBe(0);
//                     });
//                 });
//             });
//         });
//         describe('Formularios independientes > ', () => {
//             describe('Tabla maestro > ', () => {
//                 beforeEach((done) => {
//                     $('#example2').on('draw.dt', () => {
//                         setTimeout(() => {
//                             done();
//                         },300);
//                     });
//                     $('#example1 > tbody > tr > td:contains(Ana)').dblclick();
//                 });
//                 it('El formulario debe mostrarse:', () => {
//                     expect($('#example1_detail_div').is(':visible')).toBeTruthy();
//                 });
//                 it('El formulario #example2 no debe mostrarse:', () => {
//                     expect($('#example2_detail_div').is(':visible')).toBeFalsy();
//                 });
//                 describe('Funcionamiento del formulario', () => {
//                     beforeEach((done) => {
//                         $('#example1_detail_div').find('#edad_detail_table').val(11);
//                         $('#example1_detail_button_save').click();
//                         setTimeout(() => {
//                             done();
//                         },300);
//                     });
//                     it('Debe actualizar la línea en #example1:', () => {
//                         let ctx = $('#example1 > tbody > tr > td:contains(Ana)').parent();
//                         expect($('td:contains(11)', ctx).length).toBe(1);
//                     });
//                     it('No debe actualizar la línea en #example2:',() => {
//                         let ctx = $('#example2 > tbody > tr > td:contains(Ana)').parent();
//                         expect($('td:contains(11)', ctx).length).toBe(0);
//                     });
//                 });
//             });
//             describe('Tabla detalle > ', () => {
//                 beforeEach((done) => {
//                     $('#example2').on('draw.dt', () => {
//                         setTimeout(() => {
//                             $('#example2 > tbody > tr:eq(0) > td:eq(2)').dblclick();
//                             done();
//                         },300);
//                     });
//                     $('#example1 > tbody > tr:eq(0) > td:eq(0)').click();
//                 });
//                 it('El formulario debe mostrarse:', () => {
//                     expect($('#example2_detail_div').is(':visible')).toBeTruthy();
//                 });
//                 it('El formulario #example1 no debe mostrarse:', () => {
//                     expect($('#example1_detail_div').is(':visible')).toBeFalsy();
//                 });
//             });
//         });
//         describe('Ordenación independiente > ', () => {
//             beforeEach((done) => {
//                 var contx = $('#example1 > tbody > tr > td:contains(Irene)').parent();
//                 $('td.select-checkbox',contx).click();
//                 $('td.select-checkbox',contx).click();
//                 setTimeout(() => {
//                     done();
//                 },100);
//             });
//             describe('Tabla maestro > ', () => {
//                 beforeEach((done) => {
//                     //Realizamos la ordenación de #example1
//                     $('#example1').on('draw.dt',() => {
//                         setTimeout(() => {
//                             done();
//                         },300);
//                     });
//                     $('#example1').find('th:contains(Nombre)').click();
//                 });
//                 afterEach((done) => {
//                     $('#example1').on('draw.dt',() => {
//                         setTimeout(() => {
//                             done();
//                         },300);
//                     });
//                     $('#example1').find('th:contains(Id)').click();
//                 });
                
//                 it('Debe haber cambiado el orden de #example1:', () => {
//                     expect($('#example1 > tbody > tr:eq(0) > td:eq(1)').text()).toBe('1');
//                     expect($('#example1 > tbody > tr:eq(1) > td:eq(1)').text()).toBe('5');
//                     expect($('#example1 > tbody > tr:eq(2) > td:eq(1)').text()).toBe('4');
//                     expect($('#example1 > tbody > tr:eq(3) > td:eq(1)').text()).toBe('3');
//                     expect($('#example1 > tbody > tr:eq(4) > td:eq(1)').text()).toBe('2');
//                 });
//                 it('No debe haber cambiado el orden de #example2:', () => {
//                     expect($('#example2 > tbody > tr:eq(0) > td:eq(1)').text()).toBe('3');
//                     expect($('#example2 > tbody > tr:eq(1) > td:eq(1)').text()).toBe('4');
//                     expect($('#example2 > tbody > tr:eq(2) > td:eq(1)').text()).toBe('5');
//                 });
//             });
//             describe('Tabla detalle > ', () => {
//                 beforeEach((done) => {
//                     //Realizamos la ordenación de #example2
//                     $('#example2').on('draw.dt',() => {
//                         setTimeout(() => {
//                             done();
//                         },300);
//                     });
//                     $('#example2').find('th:contains(Nombre)').click();
//                 });
//                 afterEach((done) => {
//                     $('#example2').on('draw.dt',() => {
//                         setTimeout(() => {
//                             done();
//                         },300);
//                     });
//                     $('#example2').find('th:contains(Id)').click();
//                 });
//                 it('Debe haber cambiado el orden de #example2:', () => {
//                     expect($('#example2 > tbody > tr:eq(0) > td:eq(1)').text()).toBe('5');
//                     expect($('#example2 > tbody > tr:eq(1) > td:eq(1)').text()).toBe('4');
//                     expect($('#example2 > tbody > tr:eq(2) > td:eq(1)').text()).toBe('3');
//                 });
//                 it('No debe haber cambiado el orden de #example1:', () => {
//                     expect($('#example1 > tbody > tr:eq(0) > td:eq(1)').text()).toBe('1');
//                     expect($('#example1 > tbody > tr:eq(1) > td:eq(1)').text()).toBe('2');
//                     expect($('#example1 > tbody > tr:eq(2) > td:eq(1)').text()).toBe('3');
//                     expect($('#example1 > tbody > tr:eq(3) > td:eq(1)').text()).toBe('4');
//                     expect($('#example1 > tbody > tr:eq(4) > td:eq(1)').text()).toBe('5');
//                 });
//             });
//         });
//         describe('Paginación independiente > ', () => {
//             beforeEach((done) => {
//                 var contx = $('#example1 > tbody > tr > td:contains(Irene)').parent();
//                 $('td.select-checkbox',contx).click();
//                 setTimeout(() => {
//                     $('td.select-checkbox',contx).click();
//                     setTimeout(() => {
//                         done();
//                     },400);
//                 },800);
//             });
//             describe('Tabla maestro > ', () => {
//                 beforeEach((done) => {
//                     //Avanzamos una página en #example1
//                     $('#example1').on('draw.dt', () => {
//                         setTimeout(() => {
//                             done();
//                         }, 300);
//                     });
//                     $('#example1_next').click();
//                 });
//                 it('Cambia el número de página de #example1:', () => {
//                     expect($('#example1_buttons').find('li.pageSearch.searchPaginator > input').val()).toBe("2");
//                 });
//                 it('Debe haber cambiado la página de #example1:', () => {
//                     expect($('#example1 > tbody > tr:eq(0) > td:eq(1)').text()).toBe('6');
//                     expect($('#example1 > tbody > tr:eq(1) > td:eq(1)').text()).toBe('7');
//                     expect($('#example1 > tbody > tr:eq(2) > td:eq(1)').text()).toBe('8');
//                     expect($('#example1 > tbody > tr:eq(3) > td:eq(1)').text()).toBe('9');
//                     expect($('#example1 > tbody > tr:eq(4) > td:eq(1)').text()).toBe('10');
//                 });
//                 it('No cambia el número de página de #example2:', () => {
//                     expect($('#example2_buttons').find('li.pageSearch.searchPaginator > input').val()).toBe("1");
//                 });
//                 it('Debe haber cambiado la página de #example2:', () => {
//                     expect($('#example2 > tbody > tr:eq(0) > td:eq(1)').text()).toBe('3');
//                     expect($('#example2 > tbody > tr:eq(1) > td:eq(1)').text()).toBe('4');
//                     expect($('#example2 > tbody > tr:eq(2) > td:eq(1)').text()).toBe('5');
//                 });
//             });
//             describe('Tabla detalle > ', () => {
//                 beforeEach((done) => {
//                     //Avanzamos una página en #example2
//                     $('#example2').on('draw.dt', () => {
//                         setTimeout(() => {
//                             done();
//                         }, 300);
//                     });
//                     $('#example2_next').click();
//                 });
//                 it('Cambia el número de página de #example2:', () => {
//                     expect($('#example2_buttons').find('li.pageSearch.searchPaginator > input').val()).toBe("2");
//                 });
//                 it('Debe haber cambiado la página de #example2:', () => {
//                     expect($('#example2 > tbody > tr:eq(0) > td:eq(1)').text()).toBe('5');
//                     expect($('#example2 > tbody > tr:eq(1) > td:eq(1)').text()).toBe('6');
//                     expect($('#example2 > tbody > tr:eq(2) > td:eq(1)').text()).toBe('7');
//                 });
//                 it('No cambia el número de página de #example1:', () => {
//                     expect($('#example1_buttons').find('li.pageSearch.searchPaginator > input').val()).toBe("1");
//                 });
//                 it('No debe haber cambiado la página de #example1:', () => {
//                     expect($('#example1 > tbody > tr:eq(0) > td:eq(1)').text()).toBe('1');
//                     expect($('#example1 > tbody > tr:eq(1) > td:eq(1)').text()).toBe('2');
//                     expect($('#example1 > tbody > tr:eq(2) > td:eq(1)').text()).toBe('3');
//                     expect($('#example1 > tbody > tr:eq(3) > td:eq(1)').text()).toBe('4');
//                     expect($('#example1 > tbody > tr:eq(4) > td:eq(1)').text()).toBe('5');
//                 });
//             });
//         });
//         describe('Botonera y feedback independientes > ', () => {
//             beforeEach((done) => {
//                 var contx = $('#example1 > tbody > tr > td:contains(Irene)').parent();
//                 $('td.select-checkbox',contx).click();
//                 setTimeout(() => {
//                     $('td.select-checkbox',contx).click();
//                     setTimeout(() => {
//                         done();
//                     },400);
//                 },800);
//             });
//             describe('Tabla maestro > ', () => {
//                 it('Debe tener su propia botonera:', () => {
//                     let contx = $('button[aria-controls="example1"]').parent();
//                     expect($('#example1addButton_1', contx).length).toBe(1);
//                     expect($('#example1editButton_1', contx).length).toBe(1);
//                     expect($('#example1cloneButton_1', contx).length).toBe(1);
//                     expect($('#example1deleteButton_1', contx).length).toBe(1);
//                     expect($('#example1informes_01', contx).length).toBe(1);
//                 });
//                 describe('Feedback > ', () => {
//                     beforeEach((done) => {
//                         $('#rup_feedback_example1').on('rupFeedback_show', () => {
//                             done();
//                         });
//                         $('#example1 > tbody > tr:contains(Irene) > td:eq(0)').click();
//                         $('#example1editButton_1').click();
//                         $('div[aria-describedby="example1_detail_div"]')
//                             .find('#nombre_detail_table').val('Anabelle');
//                         $('div[aria-describedby="example1_detail_div"]')
//                             .find('#example1_detail_button_save').click();
//                     });
//                     it('Debe aparecer el feedback de #example1:', () => {
//                         expect($('#rup_feedback_example1').is(':visible')).toBeTruthy();
//                         expect($('#rup_feedback_example1')
//                             .is(':contains(El elemento se ha modificado correctamente.)')).toBeTruthy();
//                     });
//                     it('No debe aparecer el feedback de #example2:', () => {
//                         expect($('#rup_feedback_example2').height()).toBe(0);
//                         expect($('#rup_feedback_example2').text()).toBe('');
//                     });
//                 });
//             });
//             describe('Tabla detalle > ', () => {
//                 it('Debe tener su propia botonera:', () => {
//                     let contx = $('button[aria-controls="example2"]').parent();
//                     expect($('#example2addButton_1', contx).length).toBe(1);
//                     expect($('#example2editButton_1', contx).length).toBe(1);
//                     expect($('#example2cloneButton_1', contx).length).toBe(1);
//                     expect($('#example2deleteButton_1', contx).length).toBe(1);
//                     expect($('#example2informes_01', contx).length).toBe(1);
//                 });
//                 describe('Feedback > ', () => {
//                     beforeEach((done) => {
//                         $('#rup_feedback_example2').on('rupFeedback_show', () => {
//                             done();
//                         });
//                         $('#example2 > tbody > tr:contains(Irene) > td:eq(0)').click();
//                         $('#example2editButton_1').click();
//                         $('div[aria-describedby="example2_detail_div"]')
//                             .find('#nombre_detail_table').val('Arlene');
//                         $('div[aria-describedby="example2_detail_div"]')
//                             .find('#example2_detail_button_save').click();
//                     });
//                     it('Debe aparecer el feedback de #example2:', () => {
//                         expect($('#rup_feedback_example2').is(':visible')).toBeTruthy();
//                         expect($('#rup_feedback_example2')
//                             .is(':contains(El elemento se ha modificado correctamente.)')).toBeTruthy();
//                     });
//                     it('No debe aparecer el feedback de #example1:', () => {
//                         expect($('#rup_feedback_example1').height()).toBe(0);
//                         expect($('#rup_feedback_example1').text()).toBe('');
//                     });
//                 });
//             });
//         });
//         describe('Validaciones de formulario independientes > ', () => {
//             beforeEach((done) => {
//                 $('#example2').on('draw.dt', () => {
//                     setTimeout(() => {
//                         $('#example1 > tbody > tr:contains(Irene) > td:eq(0)').click();
//                         done();
//                     }, 300);
//                 });
//                 $('#example1 > tbody > tr:contains(Irene) > td:eq(0)').click();
//             });
//             describe('Tabla maestro > ', () => {
//                 beforeEach((done) => {
//                     $('#example1_detail_feedback').on('rupFeedback_show', () => {
//                         done();
//                     });
//                     $('#example1 > tbody > tr:contains(Irene) > td:eq(0)').click();
//                     $('#example1editButton_1').click();
//                     $('div[aria-describedby="example1_detail_div"]')
//                         .find('#nombre_detail_table').val('');
//                     $('#example1_detail_button_save').click();
//                 });
//                 it('Debe mostrar el feedback del formulario de #example1:', () => {
//                     expect($('#example1_detail_feedback').is(':visible')).toBeTruthy();
//                     expect($('#example1_detail_feedback')
//                         .is(':contains(Se han producido los siguientes errores:Nombre:Campo obligatorio.)'))
//                         .toBeTruthy();
//                 });
//                 it('No debe mostrar el feedback del formulario de #example2:', () => {
//                     expect($('#example2_detail_feedback').height()).toBe(0);
//                     expect($('#example2_detail_feedback').text()).toBe('');
//                 });
//             });
//             describe('Tabla detalle > ', () => {
//                 beforeEach((done) => {
//                     $('#example2_detail_feedback').on('rupFeedback_show', () => {
//                         done();
//                     });
//                     $('#example2 > tbody > tr:contains(Irene) > td:eq(0)').click();
//                     $('#example2editButton_1').click();
//                     $('div[aria-describedby="example2_detail_div"]')
//                         .find('#nombre_detail_table').val('');
//                     $('#example2_detail_button_save').click();
//                 });
//                 it('Debe mostrar el feedback del formulario de #example2:', () => {
//                     expect($('#example2_detail_feedback').is(':visible')).toBeTruthy();
//                     expect($('#example2_detail_feedback')
//                         .is(':contains(Se han producido los siguientes errores:Nombre:Campo obligatorio.)'))
//                         .toBeTruthy();
//                 });
//                 it('No debe mostrar el feedback del formulario de #example1:', () => {
//                     expect($('#example1_detail_feedback').height()).toBe(0);
//                     expect($('#example1_detail_feedback').text()).toBe('');
//                 });
//             });
//         });
//         describe('Gestión de errores > ', () => {
//             beforeEach((done) => {
//                 $('#example2').on('draw.dt', () => {
//                     setTimeout(() => {
//                         done();
//                     }, 300);
//                 });
//                 $('#example1 > tbody > tr:contains(Irene) > td:eq(0)').click();
//             });
//             describe('Tabla maestro > ', () => {
//                 describe('Errores al filtrar > ', () => {
//                     var setup1;
//                     beforeEach(() => {
//                         setup1 = (callback) => {
//                             $('#example1').on('xhr.dt', () => {
//                                 callback();
//                             });
//                             $('#example1_filter_fieldset').find('#id_filter_table').val('6');
//                             $('#example1_filter_filterButton').click();
//                         };
//                     });
//                     it('Setup no da error:', (done) => {
//                         expect(() => {setup1(done)}).not.toThrowError();
//                     });
//                     describe('Pruebas unitarias > ', ()=> {
//                         beforeEach((done) => {setup1(done)});
//                         it('El feedback debe mostrarse:', () => {
//                             expect($('#rup_feedback_example1_ok').height()).toBeGreaterThan(0);
//                         });
//                         it('Debe contener el mensaje esperado:', () => {
//                             expect($('#rup_feedback_example1_ok').text()).toBe('KABOOM!');
//                         });
//                     });
//                 });
//                 describe('Errores en guardado > ', () => {
//                     beforeEach((done) => {
//                         //El evento no funciona (Tambien se ha probado con #example1_detail_feedback)
//                         // $('#example1_detail_feedback_ok').on('rupFeedback_show', () => {
//                             // setTimeout(() => {
//                             //     done();
//                             // },500);
//                         // });
//                         $('#example1 > tbody > tr:contains(Ana) > td:eq(1)').dblclick();
//                         $('#example1_detail_form').find('#edad_detail_table').val('asd');
//                         $('#example1_detail_button_save').click();
//                         setTimeout(() => {
//                             done();
//                         },500);
//                     });
//                     it('El feedback de #example1 debe mostrarse:', () => {
//                         expect($('#example1_detail_feedback_ok').height()).toBeGreaterThan(0);
//                     });
//                     it('El feedback de #example2 no debe mostrarse:', () => {
//                         expect($('#example1_detail_feedback').height()).not.toBeGreaterThan(0);
//                     });
//                     it('Debe contener el mensaje esperado:', () => {
//                         expect($('#example1_detail_feedback_ok').text()).toBe('KABOOM!');
//                     });
//                 });
//                 describe('Errores en búsqueda > ', () => {
//                     beforeEach((done) => {
//                         $('#example1').on('tableSeekerSearchComplete', () => {
//                             setTimeout(() => {
//                                 done();
//                             },800);
//                         });
//                         $('#searchCollapsLabel_example1').click();
//                         $('#example1').find('#edad_seeker').val('asd');
//                         $('#search_nav_button_example1').click();
//                     });
//                     it('El feedback de #example1 debe mostrarse:', () => {
//                         expect($('#rup_feedback_example1_ok').height()).toBeGreaterThan(0);
//                     });
//                     it('El feedback de #example2 no debe mostrarse:', () => {
//                         expect($('#rup_feedback_example2').height()).toBe(0);
//                     });
//                     it('Debe contener el mensaje esperado:', () => {
//                         expect($('#rup_feedback_example1_ok').text()).toBe('KABOOM!');
//                     });
//                 });
//             });
//             describe('Tabla detalle > ', () => {
//                 describe('Errores en filtrado > ', () => {
//                     var setup2;
//                     beforeEach(() => {
//                         setup2 = (callback) => {
//                             $('#example2').on('xhr.dt', () => {
//                                 callback();
//                             });
//                             $('#example2_filter_fieldset').find('#id_filter_table').val('6');
//                             $('#example2_filter_filterButton').click();
//                         };
//                     });
//                     // it('El setup no debe lanzar errores:', (done) => {
//                     //     expect(setup2(done)).not.toThrowError();
//                     // });
//                     // describe('Pruebas unitarias > ', () => {
//                     //     beforeEach((done) => {setup2(done)});
//                     //     it('asd2', () => {
//                     //         expect(1).toBe(1);
//                     //     });
//                     // });
//                 });
//                 describe('Errores en guardado > ', () => {
//                     beforeEach((done) => {
//                         //El evento no funciona (Tambien se ha probado con #example2_detail_feedback)
//                         $('#example2_detail_feedback_ok').on('rupFeedback_show', () => {
//                             setTimeout(() => {
//                                 done();
//                             },500);
//                         });
//                         $('#example2 > tbody > tr:contains(Irene) > td:eq(1)').dblclick();
//                         $('#example2_detail_form').find('#edad_detail_table').val('asd');
//                         $('#example2_detail_button_save').click();
//                         setTimeout(() => {
//                             done();
//                         },500);
//                     });
//                     it('El feedback de #example2 debe mostrarse:', () => {
//                         expect($('#example2_detail_feedback_ok').height()).toBeGreaterThan(0);
//                     });
//                     it('El feedback de #example1 no debe mostrarse:', () => {
//                         expect($('#example1_detail_feedback').height()).toBe(0);
//                     });
//                     it('Debe contener el mensaje esperado:', () => {
//                         expect($('#example2_detail_feedback_ok').text()).toBe('KABOOM!');
//                     });
//                 });
//                 describe('Errores en búsqueda > ', () => {
//                     beforeEach((done) => {
//                         $('#searchCollapsLabel_example2').click();
//                         $('#edad_seeker').val('asd');
//                         $('#search_nav_button_example2').click();
//                         $('#example2').on('tableSeekerSearchComplete', () => {
//                             setTimeout(() => {
//                                 done();
//                             },500);
//                         });
//                     });
//                     it('El feedback de #example2 debe mostrarse:', () => {
//                         expect($('#rup_feedback_example2_ok').height()).toBeGreaterThan(0);
//                     });
//                     it('El feedback de #example1 no debe mostrarse:', () => {
//                         expect($('#rup_feedback_example1').height()).toBe(0);
//                     });
//                     it('Debe contener el mensaje esperado:', () => {
//                         expect($('#rup_feedback_example2_ok').text()).toBe('KABOOM!');
//                     });
//                 });
//             });
//         });
//     });
// });