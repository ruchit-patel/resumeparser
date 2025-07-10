console.log("---------------Resume list scripts loaded---------------");

frappe.listview_settings['Resume'] = {
    onload: function (listview) {
    },
    button: {
        show: function(doc) {
            return true;
        },
        get_label: function() {
            return __('View Resume');
        },
        get_description: function(doc) {
            return __('View details for this resume');
        },
        action: function(doc) {
            // Simple redirect to resume detail page with doc.name as parameter
            window.open(`/resume_search/detail/${doc.name}`, '_blank');
        },
        // Add styling to make the button blue
        get_indicator: function(doc) {
            return [__('View'), 'blue', ''];
        }
    }
}
