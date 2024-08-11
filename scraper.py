from bs4 import BeautifulSoup
import requests
import json
import newspaper
import time
from tqdm import tqdm

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

    # Filter out duplicates
    new_articles = [article for article in articles if article['url'] not in existing_urls]

    # Append new articles
    existing_articles.extend(new_articles)

    # Write all articles back to the file
    with open('data.json', 'w') as f:
        json.dump(existing_articles, f, indent=4)

def masterScraper():
    url_master = [
        'https://www.theverge.com/',
        'https://techcrunch.com/',
        'https://www.wired.com/',
        'https://techcrunch.com/category/artificial-intelligence/',
        'https://techcrunch.com/category/startups/',
        'https://www.theverge.com/ai-artificial-intelligence',
    ]

    while True:
        start_time = time.time()
        print(f"Starting scraping session at {time.ctime(start_time)}...")
        all_articles = []  # Initialize an empty list to store articles

        while time.time() - start_time < 60:  # Scrape for 1 minute
            for url in tqdm(url_master, desc="Processing URLs"):
                urls = get_urls(url)
                print(f'The number of links: {len(urls)}')
                
                for link in tqdm(urls, desc="Processing URLs within Master URL"):
                    if time.time() - start_time >= 60:  # Check if the time limit has been reached
                        break
                    article = get_article(link)
                    if article:
                        all_articles.append(article)
                
                if time.time() - start_time >= 60:  # Break the outer loop if time limit is reached
                    break

        # Write new articles to data.json
        print("Dumping data to data.json...")
        write_articles_to_file(all_articles)

        print("Scraping session completed. Data appended to data.json")
        time.sleep(60)  # Wait for 1 minute before starting the next scraping session

# Run the masterScraper function
masterScraper()