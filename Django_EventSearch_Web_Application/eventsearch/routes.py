from eventsearch import app
from flask import send_from_directory
from flask import request
import json
import requests
from geolib import geohash

@app.route('/',methods=['GET'])
def mainpage():

    return send_from_directory('./templates/','eventsearch.html')


@app.route('/search',methods=['GET'])
def datafetch():

    ticket_API_key="J3XzwuSYkREWmocLsLrgmFLRAAX7UDpt"
    geocoding_API_key="AIzaSyAknEIn-3stDyowTOir5fsJ9U04VT2IP2g"

    if(request.method=="GET"):
        data=json.loads(request.args['data'])
        #print(data)
    
        # Getting the Geocoding of the location data which was entered in the form

        location=data['location']

        if(location!=0):
            response_data=requests.get('https://maps.googleapis.com/maps/api/geocode/json',params={'address':location,'key':geocoding_API_key})
            response_data=response_data.json()

            lat=response_data['results'][0]['geometry']['location']['lat']
            long=response_data['results'][0]['geometry']['location']['lng']
            print("The lat and long are {} \n {}".format(lat,long))
        else:

            response_data=data['auto_location'].split(',')
            lat=response_data[0]
            long=response_data[1]

        geohash_value=geohash.encode(lat,long,7)
        #print(geohash_value)


        # Getting the Event Details
        category_mapping= {'Default':'','Music':'KZFzniwnSyZfZ7v7nJ','Sports':'KZFzniwnSyZfZ7v7nE','Theatre':'KZFzniwnSyZfZ7v7na','Arts':'KZFzniwnSyZfZ7v7na','Film':'KZFzniwnSyZfZ7v7nn','Miscellaneous':'KZFzniwnSyZfZ7v7n1'}
        
        keyword=data['keyword']
        distance=data['distance']
        segmentId=category_mapping[data['category']]

        response_events=requests.get("https://app.ticketmaster.com/discovery/v2/events.json",params={'apikey':ticket_API_key,'keyword':keyword,'segmentId':segmentId,'radius':distance,'unit':'miles','geoPoint':geohash_value})

        data_events=response_events.json()
        #print(data_events)


        browser_dictionary={'events':[]}
        date=time=icon=event=genre=venue=event_id=0

        if(data_events['page']['totalElements']!=0):
            for event in data_events['_embedded']['events']:

                if('dates' in event.keys() and 'start' in event['dates'].keys() and 'localDate' in event['dates']['start'].keys()):
                    date=event['dates']['start']['localDate']
                else:
                    date=" "

                if('dates' in event.keys() and 'start' in event['dates'].keys() and 'localTime' in event['dates']['start'].keys()):
                    time=event['dates']['start']['localTime']
                else:
                    time=" "


                if('images' in event.keys() and len(event['images'])!=0 and 'url' in event['images'][0].keys()):
                    icon=event['images'][0]['url']
                else:
                    icon=" "


                if('name' in event.keys()):
                    event_name=event['name']
                else:
                    event_name=" "

                
                if('classifications' in event.keys() and len(event['classifications'])!=0 and 'segment' in event['classifications'][0].keys() and 'name' in event['classifications'][0]['segment'].keys()):
                    genre=event['classifications'][0]['segment']['name']
                else:
                    genre=" "
                

                if('_embedded' in event.keys() and 'venues' in event['_embedded'].keys() and len(event['_embedded']['venues'])!=0 and 'name' in event['_embedded']['venues'][0].keys()):
                     venue=event['_embedded']['venues'][0]['name']
                else:
                    venue=" "

                if('id' in event.keys()):
                    event_id=event['id']
                else:
                    venue=" "
                

                browser_dictionary['events'].append({'date':date,'time':time,'icon':icon,'event':event_name,'genre':genre,'venue':venue,'event_id':event_id})

            #for event in browser_dictionary['events']:
                #print(event)
        else:
            print("No Events")
        
    return json.dumps(browser_dictionary)


@app.route('/event',methods=['GET'])
def eventdetailsfetch():

    ticket_API_key="J3XzwuSYkREWmocLsLrgmFLRAAX7UDpt"
    browser_event_dictionary={}
    if(request.method=='GET'):
        received_data=json.loads(request.args['data'])
        #print(received_data)


        response_data=requests.get("https://app.ticketmaster.com/discovery/v2/events/{}".format(received_data['id']),params={'apikey':ticket_API_key})
        response_data=response_data.json()
        #print(response_data)

        date=time=at=at_url=venue=genre=pr=ticket_status=bta=seat_map=0

        if(len(response_data.keys())!=0):
            if('dates' in response_data.keys() and 'start' in response_data['dates'].keys() and 'localDate' in response_data['dates']['start'].keys()):
                date= response_data['dates']['start']['localDate']
            
            if('dates' in response_data.keys() and 'start' in response_data['dates'].keys() and 'localTime' in response_data['dates']['start'].keys()):
                time= response_data['dates']['start']['localTime']
            else:
                time=" "
            
            browser_event_dictionary['Date']="{} {}".format(date,time)

            if('_embedded' in response_data.keys() and 'attractions' in response_data['_embedded'].keys() and len(response_data['_embedded']['attractions'])!=0 and 'name' in response_data['_embedded']['attractions'][0].keys()):
                at=response_data['_embedded']['attractions'][0]['name']
                browser_event_dictionary['AT']=at

            if('_embedded' in response_data.keys() and 'attractions' in response_data['_embedded'].keys() and len(response_data['_embedded']['attractions'])!=0 and 'url' in response_data['_embedded']['attractions'][0].keys()):
                at_url=response_data['_embedded']['attractions'][0]['url']
                browser_event_dictionary['AT_URL']=at_url

            if('_embedded' in response_data.keys() and 'venues' in response_data['_embedded'].keys() and len(response_data['_embedded']['venues'])!=0 and 'name' in response_data['_embedded']['venues'][0].keys()):
                venue=response_data['_embedded']['venues'][0]['name']
                browser_event_dictionary['Venue']=venue

            if('classifications' in response_data.keys() and len(response_data['classifications'])!=0):
                if('segment' in response_data['classifications'][0].keys() and 'name' in response_data['classifications'][0]['segment'].keys()):
                    if(response_data['classifications'][0]['segment']['name']!='Undefined'):
                        genre=response_data['classifications'][0]['segment']['name']+" | "
                
                if('genre' in response_data['classifications'][0].keys() and 'name' in response_data['classifications'][0]['segment'].keys()):
                    if(response_data['classifications'][0]['genre']['name']!='Undefined'):
                        genre=genre+response_data['classifications'][0]['genre']['name']+" | "
                
                if('subGenre' in response_data['classifications'][0].keys() and 'name' in response_data['classifications'][0]['segment'].keys()):
                    if(response_data['classifications'][0]['subGenre']['name']!='Undefined'):
                        genre=genre+response_data['classifications'][0]['subGenre']['name']+" | "
                
                if('type' in response_data['classifications'][0].keys() and 'name' in response_data['classifications'][0]['segment'].keys()):
                    if(response_data['classifications'][0]['type']['name']!='Undefined'):
                        genre=genre+response_data['classifications'][0]['type']['name']+" | "
                
                if('subType' in response_data['classifications'][0].keys() and 'name' in response_data['classifications'][0]['segment'].keys()):
                    if(response_data['classifications'][0]['subType']['name']!='Undefined'):
                        genre=genre+response_data['classifications'][0]['subType']['name']
                

                browser_event_dictionary['Genres']=genre.strip('| ')
        

            if('priceRanges' in response_data.keys() and len(response_data['priceRanges'])!=0 and 'min' in response_data['priceRanges'][0].keys()):
                pr=str(response_data['priceRanges'][0]['min'])+" - "

            if('priceRanges' in response_data.keys() and len(response_data['priceRanges'])!=0 and 'max' in response_data['priceRanges'][0].keys()):
                pr=pr+str(response_data['priceRanges'][0]['max'])+" USD"

                browser_event_dictionary['PR']=pr

            if('dates' in response_data.keys() and 'status' in response_data['dates'].keys() and 'code' in response_data['dates']['status'].keys()):
                ticket_status= response_data['dates']['status']['code']
                browser_event_dictionary['TS']=ticket_status


            if('url' in response_data.keys()):
                bta=response_data['url']
                browser_event_dictionary['BTA']=bta
                
            if('seatmap' in response_data.keys() and 'staticUrl' in response_data['seatmap'].keys()):
                seat_map=response_data['seatmap']['staticUrl']
                browser_event_dictionary['SM']=seat_map

            browser_event_dictionary['name']=response_data['name']

        #print(browser_event_dictionary)

    return json.dumps(browser_event_dictionary)


@app.route('/venue',methods=['GET'])
def venuedetailsfetch():

    ticket_API_key="J3XzwuSYkREWmocLsLrgmFLRAAX7UDpt"
    browser_venue_dictionary={}

    if(request.method=="GET"):
        received_data=json.loads(request.args['data'])
        #print(received_data)


        response_data=requests.get("https://app.ticketmaster.com/discovery/v2/venues/",params={'apikey':ticket_API_key,'keyword':received_data['venue']})
        response_data=response_data.json()
        #print(response_data)

        name=address=city=state_code=pc=uc=""

        if(len(response_data.keys())!=0):
            if('_embedded' in response_data.keys()):
                if(len(response_data['_embedded'].keys())!=0):
                    if('venues' in response_data['_embedded'].keys() and len(response_data['_embedded']['venues'])!=0 and 'name' in response_data['_embedded']['venues'][0].keys()):
                        name=response_data['_embedded']['venues'][0]['name']
                        browser_venue_dictionary['name']=name
                    
                    if('venues' in response_data['_embedded'].keys() and len(response_data['_embedded']['venues'])!=0 and 'address' in response_data['_embedded']['venues'][0].keys() and 'line1' in response_data['_embedded']['venues'][0]['address'].keys()):
                        address=response_data['_embedded']['venues'][0]['address']['line1']
                        browser_venue_dictionary['address']=address 
                    
                    if('venues' in response_data['_embedded'].keys() and len(response_data['_embedded']['venues'])!=0 and 'city' in response_data['_embedded']['venues'][0].keys() and 'name' in response_data['_embedded']['venues'][0]['city'].keys()):
                        city=response_data['_embedded']['venues'][0]['city']['name']

                    if('venues' in response_data['_embedded'].keys() and len(response_data['_embedded']['venues'])!=0 and 'state' in response_data['_embedded']['venues'][0].keys() and 'stateCode' in response_data['_embedded']['venues'][0]['state'].keys()):
                        state_code=response_data['_embedded']['venues'][0]['state']['stateCode']

                    browser_venue_dictionary['city']= city +', '+ state_code

                    if('venues' in response_data['_embedded'].keys() and len(response_data['_embedded']['venues'])!=0 and 'postalCode' in response_data['_embedded']['venues'][0].keys()):
                        pc=response_data['_embedded']['venues'][0]['postalCode']
                        browser_venue_dictionary['pc']=pc
                    
                    if('venues' in response_data['_embedded'].keys() and len(response_data['_embedded']['venues'])!=0 and 'url' in response_data['_embedded']['venues'][0].keys()):
                        uc=response_data['_embedded']['venues'][0]['url']
                        browser_venue_dictionary['uc']=uc

        print(browser_venue_dictionary)

    return  json.dumps(browser_venue_dictionary)