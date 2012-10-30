(function() {

  jQuery(function() {
    return $('#lessons-list').sortable({
      axis: 'y',
      handle: '.handle',
      update: function() {
        return $.post($(this).data('update-url'), $(this).sortable('serialize'));
      }
    });
  });

}).call(this);
