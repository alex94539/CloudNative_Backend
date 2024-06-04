import random, string
from locust import HttpUser, between, task

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

class AwesomeUser(HttpUser):
    host = "http://10.87.6.176:9999"

    # we assume someone who is browsing the Locust docs,
    # generally has a quite long waiting time (between
    # 10 and 600 seconds), since there's a bunch of text
    # on each page
    wait_time = between(1, 5)
    nextRoom = None; queryDate = None; nextReserve = None
    token = ""

    userId = '66523c7354e9afbf8184780b'

    def on_start(self):
        # start by waiting so that the simulated users
        # won't all arrive at the same time
        self.wait()
        # assume all users arrive at the index page
        r = self.client.post("/authenticate/login", {
            "username": "euphokumiko",
            "password": "shinycolors"
        })
        self.token = r.json()['token']
        self.client.headers.update({'Authorization': 'Bearer {}'.format(self.token)})

    @task(5)
    def index_page(self):
        r = self.client.get("/info/rooms")
        self.nextRoom = r.json()[0]['_id']

    @task
    def room_info(self):
        if self.nextRoom is None:
            return
        r = self.client.get('/info/room?roomId={}'.format(self.nextRoom), name='/info/room')

    @task
    def new_room(self):
        r = self.client.post('/info/room', {
            'name': id_generator(),
            'building': id_generator(),
            'capacity': random.randint(1, 20),
            'area': random.randint(1, 40),
            'eating': 1 if random.randint(0, 1) == 1 else 0
        })
        self.nextRoom = r.json()['_id']

    @task
    def patch_room(self):
        if self.nextRoom is None:
            return
        r = self.client.patch('/info/room?roomId={}'.format(self.nextRoom), {
            'name': id_generator(),
            'building': id_generator(),
            'capacity': random.randint(1, 20),
            'area': random.randint(1, 40)
        }, name='/info/room')

    @task
    def get_room_status(self):
        if self.nextRoom is None or self.queryDate is None:
            return
        r = self.client.get('/info/room_status?roomId={}&date={}'.format(self.nextRoom, self.queryDate), name='/info/room_status')

    @task
    def get_reserves(self):
        r = self.client.get('/info/reserves')
        self.nextReserve = r.json()[-1]['_id']

    @task
    def get_reserve(self):
        if self.nextReserve is None:
            return
        r = self.client.get('/info/reserve?meetId={}'.format(self.nextReserve), name='/info/reserve')

    @task
    def post_reserve(self):
        if self.nextRoom is None:
            return
        r = self.client.post('/info/reserve', {
            'title': id_generator(),
            'desc': id_generator(),
            'attendants': '{},{}'.format(self.userId, self.userId),
            'timeSlot': random.randint(1, 24),
            'rDate': '2024-{}-{}'.format(random.randint(10, 12), random.randint(10, 30)),
            'userId': self.userId,
            'roomId': self.nextRoom
        })

    @task
    def get_meetings(self):
        r = self.client.get('/info/meetings')

