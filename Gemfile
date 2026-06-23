source "https://rubygems.org"

# These were extracted from the Ruby stdlib in 3.4+; keep them explicit so the
# build works across Ruby versions.
gem "csv"
gem "bigdecimal"
gem "base64"

# Jekyll 4 toolchain. We dropped the `github-pages` gem, which hard-pinned
# Jekyll 3.9 (and old liquid/kramdown) and was the main cause of slow builds
# (issue #81). The site now publishes via a full `bundle exec jekyll build` in
# GitHub Actions (issue #98), so the legacy GitHub Pages gem environment is no
# longer required.
gem "jekyll", "~> 4.3"

# Plugins that the github-pages gem used to auto-enable and that this site
# relies on. They must now be declared explicitly (also listed in _config.yml
# `plugins:`).
group :jekyll_plugins do
  gem "jekyll-sitemap"          # /sitemap.xml
  gem "jekyll-relative-links"   # rewrites internal .md links -> .html in source
  gem "jekyll-include-cache"    # just-the-docs uses {% include_cached %}
  gem "jekyll-seo-tag"          # just-the-docs head dependency
end

gem 'wdm', '>= 0.1.0' if Gem.win_platform?
gem "webrick", "~> 1.7"
gem "just-the-docs", "0.12.0"
