from bs4 import BeautifulSoup
import requests 
import json
import newspaper
import os
import time
from tqdm import tqdm

def get_urls(url:str) -> list[str]:
    base_urls={'verge':'https://www.theverge.com/','techcrunch':'https://techcrunch.com/','wired':'https://www.wired.com/'}
    def isNewsURL(url:str)->bool:
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




def get_article(url:str):
    article = newspaper.Article(url=url,language='en')
    try:
        article.download()
        article.parse()
    except Exception as e:
        print(e)
        pass

    article_data = {
        'title' : str(article.title),
        'text' : str(article.text),
        'authors' : str(article.authors),
        'top_image' : str(article.top_image),
        'keywords' : str(article.keywords),
        'summary' : str(article.summary),
        'url' : str(url),
        'timestamp' : str(time.time()),
        'displayed': 0

    }

    return article_data

url_master = ['https://www.theverge.com/','https://techcrunch.com/','https://www.wired.com/','https://techcrunch.com/category/artificial-intelligence/','https://techcrunch.com/category/startups/','https://www.theverge.com/ai-artificial-intelligence',]

total=0
for url in tqdm(url_master, desc="Processing URLs"):
    urls = get_urls(url)
    print('The number of links',len(urls))
    total+=len(urls)
    print('The total number of links',total)
    for url in tqdm(urls, desc="Processing URLs within Master URL"):
        article = get_article(url)
        with open('data.json', 'a') as f:
            f.write('//   '+url + '\n')
            json.dump(article, f)
            f.write('\n')