Main = {
    colors : [
        "rgba(227, 0, 43, 0.7)",
        "rgba(226, 28, 101, 0.7)",
        "rgba(255, 105, 0, 0.7)"
    ],
    langs : {},
    getProjects : function() {
        $.get('js/projects.js', Main.loadProjects);
    },
    loadProjects : function(projects) {
        projects = $.parseJSON(projects);
        projects.sort(Main.sortNames);
        var parent = $('#projects ul');
        var template = parent.find('.project').clone();
        parent.find('.project').remove();

        $.each(projects, function(index, project) {
            var item = template.clone();
            var langClass = Main.toClass(project.language);
            item.find('.name').html(project.name);
            item.find('.desc').html(project.description);
            item.find('.lang').html(project.language);
            item.find('.github').attr('href', project.html_url);
            item.css('background', Main.randomColor()),
            item.addClass(langClass);
            parent.append(item);

            Main.addLang(project.language);
        });

        Main.buildFilter();
    },
    randomColor : function() {
        var index = Math.floor(Math.random() * Main.colors.length);
        return Main.colors[index];
    },
    sortNames : function(p1, p2) {
        name1 = p1.name.toLowerCase();
        name2 = p2.name.toLowerCase();
        if (name1 < name2)
            return -1;
        if (name1 > name2)
            return 1;
        return 0;
    },
    addLang : function(lang) {
        if(lang) {
            Main.langs[lang] = true;
        }
    },
    buildFilter: function() {
        var filters = $('#filters');
        var all = filters.find('a');
        for (lang in Main.langs) {
            var filter = all.clone();
            var langClass = Main.toClass(lang);
            filter.attr('data-lang', langClass);
            filter.addClass('animated');
            filter.html(lang.replace(/-/g, '&#8209;'));

            filters.append(filter);
        }
        filters.find('a').on('click', Main.filterByLang);
        all.addClass('selected');
    },
    toClass : function(str) {
        if(str)
            return str.replace(/\+/g, '-plus');
        else
            return str;
    },
    filterByLang : function(evt) {
        $('#filters a.selected').removeClass('selected');
        $(this).addClass('selected');

        var lang = $(this).attr('data-lang');
        var selector = lang == 'all' ? 'li' : 'li.' + lang;

        $('#projects ul li').hide('slow', 'swing');
        $('#projects ul ' + selector).fadeIn('slow', 'swing');
    }
};

$(function() {
    Main.getProjects();
});
