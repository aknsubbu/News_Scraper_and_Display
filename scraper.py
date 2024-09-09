from bs4 import BeautifulSoup
import requests
import json
import newspaper
import time
from tqdm import tqdm
import os
from datetime import datetime

def get_urls(url: str) -> list[str]:
    base_urls = {
        'verge': 'https://www.theverge.com/',
        'techcrunch': 'https://techcrunch.com/',
        'wired': 'https://www.wired.com/'
    }

    def isNewsURL(url: str) -> bool:
        for base_url in base_urls.values():
            if base_url in url:
                return True
        return False

    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    urls = []
    for link in soup.find_all('a'):
        if link.get('href') and isNewsURL(link.get('href')):
            urls.append(link.get('href'))
    return urls

def get_article(url: str):
    article = newspaper.Article(url=url, language='en')
    try:
        article.download()
        article.parse()
    except Exception as e:
        print(f"Error processing {url}: {e}")
        return None  # Return None if there's an error

    article_data = {
        'title': str(article.title),
        'text': str(article.text),
        'authors': str(article.authors),
        'top_image': str(article.top_image),
        'keywords': str(article.keywords),
        'summary': str(article.summary),
        'url': str(url),
        'timestamp': str(time.time()),
        'displayed': 0
    }

    return article_data

def read_existing_articles():
    try:
        with open('data.json', 'r') as f:
            existing_articles = json.load(f)
            existing_urls = {article['url'] for article in existing_articles}
    except (FileNotFoundError, json.JSONDecodeError):
        existing_articles = []
        existing_urls = set()

    return existing_articles, existing_urls

def write_articles_to_file(articles):
    try:
        with open('data.json', 'r') as f:
            existing_articles = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_articles = []

    existing_urls = {article['url'] for article in existing_articles}

    # Filter out duplicates and add new articles
    new_articles = [article for article in articles if article['url'] not in existing_urls]
    
    # Combine new and existing articles
    all_articles = new_articles + existing_articles
    
    # Sort all articles by timestamp (newest first)
    all_articles.sort(key=lambda x: float(x['timestamp']), reverse=True)

    # Write all articles back to the file
    with open('data.json', 'w') as f:
        json.dump(all_articles, f, indent=4)

def archive_data_json():
    if os.path.exists('data.json'):
        now = datetime.now()
        archive_folder = 'data_archives'
        if not os.path.exists(archive_folder):
            os.makedirs(archive_folder)
        archive_file = os.path.join(archive_folder, f'data_{now.strftime("%Y%m%d_%H%M%S")}.json')
        os.rename('data.json', archive_file)
        print(f'Archived data.json to {archive_file}')
        open('data.json', 'w').close()  # Create a new empty data.json file

def masterScraper():
    url_master = [
        'https://www.theverge.com/',
        'https://techcrunch.com/',
        'https://www.wired.com/',
        'https://techcrunch.com/category/artificial-intelligence/',
        'https://techcrunch.com/category/startups/',
        'https://www.theverge.com/ai-artificial-intelligence',
        "https://arstechnica.com",
        "https://www.engadget.com/?guccounter=1",
        "https://www.cnet.com",
        "https://www.techradar.com",
    ]
    
    while True:
        start_time = time.time()
        print(f"Starting scraping session at {time.ctime(start_time)}...")
        all_articles = []  # Initialize an empty list to store articles

        for url in tqdm(url_master, desc="Processing URLs"):
            urls = get_urls(url)
            print(f'The number of links: {len(urls)}')
            for link in tqdm(urls, desc="Processing URLs within Master URL"):
                article = get_article(link)
                if article:
                    all_articles.append(article)
                
                # Write to file every 10 articles or if it's the last article
                if len(all_articles) % 4 == 0 or link == urls[-1]:
                    print("Writing articles to data.json...")
                    write_articles_to_file(all_articles)
                    all_articles = []  # Clear the list after writing

        end_time = time.time()
        elapsed_time = end_time - start_time
        if elapsed_time < 300:  # 5 minutes
            print("Scraping session completed. Waiting before next session...")
            time.sleep(15)  # Wait for 15 seconds before starting the next scraping session
        else:
            print("No new links found in 5 minutes. Archiving data.json and starting a new scraping session.")
            archive_data_json()

# Run the masterScraper function
masterScraper()