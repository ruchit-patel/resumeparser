// console.log("---------------DocShare list scripts loaded---------------");

// frappe.listview_settings['DocShare'] = {
//     onload: function (listview) {
//         // listview.filter_area.add([
//         //     [listview.doctype, 'user', '=', frappe.session.user],            
//         //     [listview.doctype, 'share_doctype', '=', 'Resume']
//         // ]);
//     },
//     button: {
//         show: function(doc) {
//             return true;
//         },
//         get_label: function() {
//             return __('View DocShare');
//         },
//         get_description: function(doc) {
//             return __('View details for this docshare');
//         },
//         action: function(doc) {
//             // Simple redirect to docshare detail page with doc.name as parameter
//             window.open(`/resume_search/detail/${doc.name}`, '_blank');
//         },
//         // Add styling to make the button blue
//         get_indicator: function(doc) {
//             return [__('View'), 'blue', ''];
//         }
//     }
// }
