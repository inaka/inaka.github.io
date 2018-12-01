//34c8e27ff36cfd2373abdacea28644f0ecc1fd8d

const fetch = require('node-fetch');
const fs = require('fs');
const R = require('ramda');


const accessToken = 'YOU_NEED_TO_GENERATE_YOURS';
var groupsOf = R.curry(function group(n, list) {
    return R.isEmpty(list) ? [] : R.prepend(R.take(n, list), group(n, R.drop(n, list)));
})(3);

const query = `
query { 
    organization(login: "inaka") { 
        repositories(first: 100, orderBy: {field: NAME, direction: ASC}) 
        { 
            nodes { 
                name description projectsUrl primaryLanguage { name }
            } 
        } 
    } 
}`;



fetch('https://api.github.com/graphql', {
        method: 'POST',
        body: JSON.stringify({
            query
        }),
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(res => res.json())
    .then(body => {
        let nodes = {nodes: groupsOf(body.data.organization.repositories.nodes)};
        nodes.nodes = nodes.nodes.map(node => node.map(
            elm => {
                if(elm.primaryLanguage){
                    elm.imageSuffix = elm.primaryLanguage.name.toLowerCase();

                    switch(elm.imageSuffix) {
                        case 'erlang':
                        case 'swift':
                        case 'elixir':
                        case 'objective-c':
                        case 'makefile':
                            break;
                        default:
                            elm.imageSuffix  = 'erlang';
                    }
                } else {
                    elm.imageSuffix = 'other';
                }

                elm.projectsUrl = elm.projectsUrl.replace('/projects', '')

                return elm;
            }
        ));
        while(R.last(nodes.nodes).length < 3) R.last(nodes.nodes).push({});
        fs.writeFileSync('repose.json', JSON.stringify(nodes), err => console.error(err));
        console.log('FINISHED!!');
    })
    .catch(error => console.error(error));