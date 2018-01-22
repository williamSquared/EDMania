from bs4 import BeautifulSoup
import urllib.request
import pymongo
from pymongo import MongoClient
import local_settings

data = []

urls = ["http://www.global-sets.com/", "http://www.global-sets.com/page/2/", "http://www.global-sets.com/page/3/", "http://www.global-sets.com/page/4/"]
# urls = ["http://www.global-sets.com/"]

def insertDataInMongo(data):
	connection = pymongo.MongoClient('ds111648.mlab.com', 11648)
	db = connection['edmania']
	db.authenticate(local_settings.secret_keys['MLAB_USER'], local_settings.secret_keys['MLAB'])

	try:
		db.setData.insert_many(data, ordered=False)
	except pymongo.errors.BulkWriteError as e:
		pass # Ignoring error mentioning duplicates

def downloadSetData():
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
			download_links = buildDownloadLinks(links)

			set_info = recent_details_soup.find_all('div', class_="entry")[0].find('p').get_text().split('\n')
			image_url = str(recent.find('img')['src']).replace("-310x165", "")

			iHeartTrackId = getIHeartTrackId(str(recent_details_soup.find_all('div', class_="hearthis-widget")))
			iHeartTrackURL = buildMediaPlayerLink(iHeartTrackId)

			createDataObject(set_info, download_links, image_url, iHeartTrackURL)

def buildDownloadLinks(links):
	download_links = {}

	for link in links:
		if 'http://ul' in link['href']:
			download_links['uploaded'] = link['href']
		else:
			download_links['zippyshare'] = link['href']

	return download_links

def getIHeartTrackId(iHeartString):
	start = 'embed/'
	end = '/transparent_black'
	return iHeartString[iHeartString.find(start)+len(start):iHeartString.rfind(end)]

def buildMediaPlayerLink(trackId):
	return "<iframe scrolling='no' id='hearthis_at_track_'" + trackId + " width='100%' height='130' src='https://hearthis.at/embed/" + trackId + "/transparent/?hcolor=&color=&style=2&block_size=2&block_space=1&background=0&waveform=0&cover=1&autoplay=0&css=' frameborder='0' allowtransparency>"

def createDataObject(set_info, download_links, image_url, iHeartTrackURL):
	data.append({
		'artist': set_info[0].split(':')[1].strip(),
		'title': set_info[1].split(':')[1].strip(),
		'quality': set_info[2].split(':')[1].strip(),
		'duration': set_info[3].split(': ')[1].strip(), # added space in split to capture minutes and seconds
		'size': set_info[4].split(':')[1].strip().replace(',', '.'),
		'genre': set_info[5].split(':')[1].strip(),
		'image': image_url,
		'download_links': download_links,
		'iHeartTrackURL': iHeartTrackURL
	})

downloadSetData()
insertDataInMongo(data)

print('Done')