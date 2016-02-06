#!/usr/bin/env python
# Name: Mainah Folkers
# Student number: 10535845
'''
This script scrapes IMDB and outputs a CSV file with highest ranking tv series.
'''
# IF YOU WANT TO TEST YOUR ATTEMPT, RUN THE test-tvscraper.py SCRIPT.
import csv

from pattern.web import URL, DOM, encode_utf8

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    '''
    Extract a list of highest ranking TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Ranking
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    tvseries = []

    # iterates over top 50 IMBD tv series
    for tvserie in dom.by_tag("td.title")[:50]:
        tvserie_array = []
        # tv serie title is encoded and added to tv serie array
        for title in tvserie.by_tag("a")[:1]:
            tvserie_array.append(encode_utf8(title.content))
        # tv serie ranking is encoded and added to tv serie array
        for ranking in tvserie.by_tag("span.value")[:1]:
            tvserie_array.append(encode_utf8(ranking.content))
        # tv serie genres are added to tv serie array
        for genres in tvserie.by_tag("span.genre")[:1]:
            genres_array = []
            # genre is encoded and added to genres array
            for genre in genres.by_tag("a"):
                genres_array.append(encode_utf8(genre.content))
            tvserie_array.append(genres_array)
        # tv serie actors are added to tv serie array
        for actors in tvserie.by_tag("span.credit")[:1]:
            actors_array = []
            # actor is encoded and added to actors array
            for actor in actors.by_tag("a"):
                actors_array.append(encode_utf8(actor.content))
            tvserie_array.append(actors_array)
        # tv serie runtime is encoded, stripped to numbers and added to tv serie array
        for runtime in tvserie.by_tag("span.runtime")[:1]:
            encode_utf8(runtime.content)
            runtime = runtime.content.rstrip(' mins.')
            tvserie_array.append(runtime)
        tvseries.append(tvserie_array)

    return tvseries

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest ranking TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Ranking', 'Genre', 'Actors', 'Runtime'])

    # iterates over tv series
    for tvserie in tvseries:
        # and writes them one by one in csv file
        writer.writerow(tvserie)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in testing / grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
