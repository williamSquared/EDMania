from bs4 import BeautifulSoup
import urllib.request
import json
from progressbar import ProgressBar, Percentage, Bar
import time

start_time = time.time()

data = []
# urls = ["http://www.global-sets.com/", "http://www.global-sets.com/page/2/", "http://www.global-sets.com/page/3/", "http://www.global-sets.com/page/4/"]
urls = ["http://www.global-sets.com/"]

pbar = ProgressBar(widgets=[Percentage(), Bar()], maxval=len(urls) * 30 + 1).start()
progress = 0

for url in urls:
	page = urllib.request.urlopen(url)
	soup = BeautifulSoup(page.read(), "html.parser")
	recents = soup.find_all('div', class_='recent-item')

	for recent in recents:
		recent_details_url = recent.find('a')['href']
		recent_details = urllib.request.urlopen(recent_details_url)
		recent_details_soup = BeautifulSoup(recent_details.read(), "html.parser")

		if len(recent_details_soup.find_all('div', class_='toggle-content')) < 1:
			continue
		links = recent_details_soup.find_all('div', class_='toggle-content')[1].find_all('a')
		download_links = {}
		for link in links:
			if 'http://ul' in link['href']:	
				download_links['uploaded'] = link['href']
			else:
				download_links['zippyshare'] = link['href']

		set_info = recent_details_soup.find_all('div', class_="entry")[0].find('p').get_text().split('\n')

		data.append({
			'artist': set_info[0].split(':')[1].strip(),
			'title': set_info[1].split(':')[1].strip(), 
			'quality': set_info[2].split(':')[1].strip(),
			'duration': set_info[3].split(': ')[1].strip(), # added space in split to capture minutes and seconds 
			'size': set_info[4].split(':')[1].strip().replace(',', '.'),
			'genre': set_info[5].split(':')[1].strip(),
			'image': str(recent.find('img')['src']).replace("-310x165", ""),
			'download_links': download_links
		})
		progress += 1
		pbar.update(progress)

with open('public/data/set_data.json', 'w') as outfile:
	json.dump(data, outfile, ensure_ascii=False, indent=4)

progress += 1
pbar.update(progress)
pbar.finish()

end_time = time.time()

print('Done')
print('Total Execution Time: {}'.format(end_time - start_time))