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
COMMA = ','

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
        genres_array = []
        actors_array = []
        # tv serie title is encoded and added to tv serie array
        title = tvserie("a")[0].content
        tvserie_array.append(encode_utf8(title))
        # tv serie ranking is encoded and added to tv serie array
        ranking = tvserie("span.value")[0].content
        tvserie_array.append(encode_utf8(ranking))
        # tv serie genres are added to tv serie array
        for genres in tvserie("span.genre a"):
            # genre is encoded and added to genres array
            genres_array.append(encode_utf8(genres.content))
        # seprates genres with commas
        genres = COMMA.join(genres_array)
        tvserie_array.append(genres)
        # tv serie actors are added to tv serie array
        for actors in tvserie("span.credit a"):
            # actor is encoded and added to actors array
            actors_array.append(encode_utf8(actors.content))
        # seprates actors with commas
        actors = COMMA.join(actors_array)
        tvserie_array.append(actors)
        # tv serie runtime is encoded and stripped to numbers
        runtime = encode_utf8(tvserie("span.runtime")[0].content)
        runtime = runtime.rstrip(' mins.')
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
