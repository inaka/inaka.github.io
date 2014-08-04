Main = {
    colors : [
        "rgba(227, 0, 43, 0.7)",
        "rgba(226, 28, 101, 0.7)",
        "rgba(255, 105, 0, 0.7)"
    ],
    getProjects : function() {
        $.get('js/projects.js', Main.loadProjects);
    },
    loadProjects : function(projects) {
        projects = $.parseJSON(projects);
        projects.sort(Main.sortNames);
        var parent = $('#projects');
        var template = parent.find('.project').clone();
        parent.find('.project').hide();

        $.each(projects, function(index, project) {
            var item = template.clone();
            item.find('.name').html(project.name);
            item.find('.desc').html(project.description);
            item.find('.lang').html(project.language);
            item.find('.github').attr('href', project.html_url);
            item.css('background', Main.randomColor()),
            parent.append(item);
        });
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
    }
};

$(function() {
    Main.getProjects();
});
