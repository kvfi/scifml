import markdown2
import os
import sys

from flask import abort, Flask, request, render_template
from flask_sslify import SSLify
from datetime import datetime
from skeleton import posts

app = Flask(__name__, template_folder="templates")
app.config.update(dict(PREFERRED_URL_SCHEME='https'))

sslify = SSLify(app, subdomains=True)

resources_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'resources/files'))


@app.template_filter('strftime')
def datetimeformat(value):
    date = datetime.strptime(value, "%Y-%m-%d")
    day = date.day
    if 4 <= day <= 20 or 24 <= day <= 30:
        suffix = "th"
    else:
        suffix = ["st", "nd", "rd"][day % 10 - 1]
    return date.strftime('%B %e<sup>' + suffix + '</sup> %Y')


@app.template_filter('implode')
def implode_list(x, sep):
    return sep.join(x)


@app.route("/", endpoint='home')
def home():
    headmeta = {'title': 'Ouafi.net', 'description': ''}
    post = posts.Post.get_home()
    with open(resources_dir + '/' + 'misc/intro.md', 'r') as content_file:
        intro_txt = markdown2.markdown(content_file.read(), extras=["metadata", "header-ids", "footnotes"])
    return render_template('home.html', headMeta=headmeta, intro_txt=intro_txt, posts=post)


@app.route("/<slug>.html", endpoint='post')
def entry(slug):
    post = posts.Post.get_post(slug)
    meta = post['meta']
    head_meta = {'title': meta['title'], 'description': meta['subtitle']}
    if ('pc' in meta and (meta['pc'] == request.args.get('c'))) or 'pc' not in meta:
        return render_template('post.html', headMeta=head_meta, post=post)
    else:
        abort(404)


@app.route("/french.html", endpoint='home_fr')
def home_fr():
    headmeta = {'title': 'Ouafi.net', 'description': ''}
    post = posts.Post.get_home()
    with open(resources_dir + 'misc/intro_fr.md', 'r', encoding='utf8') as content_file:
        intro_txt = markdown2.markdown(content_file.read(), extras=["metadata", "header-ids", "footnotes"])
    return render_template('home.html', headMeta=headmeta, intro_txt=intro_txt, posts=post)


@app.errorhandler(404)
def page_not_found(e):
    head_meta = {'title': 'Page not found, sorry.', 'description': 'Page not found.'}
    return render_template('404.html', headMeta=head_meta, error=e), 404


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        exit(0)
    elif len(sys.argv) > 1 and sys.argv[1] == "debug":
        app.run(debug=True)
    else:
        app.run()
