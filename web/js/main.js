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
            item.find('.authors').html(project.authors.join(', '));
            item.find('.desc').html(project.description);
            item.find('.lang').html(project.language);
            item.find('.stars span').text(project.stargazers_count);
            item.find('.forks span').text(project.forks);
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
        if (p1.name < p2.name)
            return -1;
        if (p1.name > p2.name)
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
    },
    qsVal: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    format : function() {
        var fmt = Main.qsVal("format");
        console.log(fmt);
        if(fmt == "iframe") {
            $("nav.navbar").hide();
            $("section.information").css("margin-top", "10px");
        }
    }
};

$(function() {
    Main.getProjects();

    Main.format();
});
