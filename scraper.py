import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import newspaper
import time
from tqdm import tqdm
import os
from datetime import datetime
import logging
from urllib.parse import urljoin

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

base_urls = {
    'verge': 'https://www.theverge.com/',
    'techcrunch': 'https://techcrunch.com/',
    'wired': 'https://www.wired.com/',
    'techcrunch_ai': 'https://techcrunch.com/category/artificial-intelligence/',
    'techcrunch_startups':'https://techcrunch.com/category/startups/',
    'verge_ai':'https://www.theverge.com/ai-artificial-intelligence',
    'arstechnica':"https://arstechnica.com",
    'engadget':"https://www.engadget.com/?guccounter=1",
    'cnet':"https://www.cnet.com",
    'techradar':"https://www.techradar.com",
}

async def get_urls(session, url):
    try:
        async with session.get(url) as response:
            if response.status != 200:
                logging.warning(f"Failed to fetch {url}: HTTP {response.status}")
                return []
            html = await response.text()
        soup = BeautifulSoup(html, 'html.parser')
        urls = [urljoin(url, link.get('href')) for link in soup.find_all('a', href=True)
                if any(base_url in urljoin(url, link.get('href')) for base_url in base_urls.values())]
        return list(set(urls))  # Remove duplicates
    except Exception as e:
        logging.error(f"Error fetching URLs from {url}: {e}")
        return []

async def get_article(session, url):
    article = newspaper.Article(url=url, language='en')
    try:
        await asyncio.to_thread(article.download)
        await asyncio.to_thread(article.parse)
    except Exception as e:
        logging.error(f"Error processing {url}: {e}")
        return None

    return {
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
    existing_articles, existing_urls = read_existing_articles()
    new_articles = [article for article in articles if article['url'] not in existing_urls]
    all_articles = new_articles + existing_articles
    all_articles.sort(key=lambda x: float(x['timestamp']), reverse=True)
    with open('data.json', 'w') as f:
        json.dump(all_articles, f, indent=4)
    logging.info(f"Added {len(new_articles)} new articles to data.json")

def archive_data_json():
    if os.path.exists('data.json'):
        now = datetime.now()
        archive_folder = 'data_archives'
        os.makedirs(archive_folder, exist_ok=True)
        archive_file = os.path.join(archive_folder, f'data_{now.strftime("%Y%m%d_%H%M%S")}.json')
        os.rename('data.json', archive_file)
        logging.info(f'Archived data.json to {archive_file}')
        open('data.json', 'w').close()

async def process_url(session, url):
    urls = await get_urls(session, url)
    logging.info(f'Number of links from {url}: {len(urls)}')
    articles = []
    for link in tqdm(urls, desc=f"Processing URLs from {url}", leave=False):
        article = await get_article(session, link)
        if article:
            articles.append(article)
    return articles

async def masterScraper():
    url_master = list(base_urls.values())
    
    while True:
        start_time = time.time()
        logging.info(f"Starting scraping session at {time.ctime(start_time)}...")
        
        all_articles = []
        
        async with aiohttp.ClientSession() as session:
            for url in tqdm(url_master, desc="Processing URLs"):
                urls = await get_urls(session, url)
                logging.info(f'Number of links from {url}: {len(urls)}')
                
                for link in tqdm(urls, desc=f"Processing URLs from {url}", leave=False):
                    article = await get_article(session, link)
                    if article:
                        all_articles.append(article)
                        
                    # Write to file every 10 articles
                    if len(all_articles) >= 10:
                        write_articles_to_file(all_articles)
                        all_articles = []
        
        # Write any remaining articles
        if all_articles:
            write_articles_to_file(all_articles)
        
        end_time = time.time()
        elapsed_time = end_time - start_time
        if elapsed_time < 300:  # 5 minutes
            logging.info("Scraping session completed. Waiting before next session...")
            await asyncio.sleep(15)
        else:
            logging.info("No new links found in 5 minutes. Archiving data.json and starting a new scraping session.")
            archive_data_json()


if __name__ == "__main__":
    asyncio.run(masterScraper())