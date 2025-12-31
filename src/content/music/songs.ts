export interface Song {
  title: string;
  slug: string;
  audioSrc: string;
  lyrics: string;
  ring?: number; // 1–8 for vertical positioning in the structure
  credits?: string; // Production credits
  releaseDate?: string; // Release date for the song
}

export const songs: Song[] = [
  {
    title: "Rush",
    slug: "rush",
    audioSrc: "/audio/rush_final2.wav",
    credits: "Prod. michael harrison\nmix, master, lyrics and vocals by me",
    lyrics: `Something that I can feel
Substantiates what is real
When the abstract starts to heal
I wear self-love as a zeal
I see you in shades of teal
Something divine, I get down and kneel
It's a love that still ended up killed
The price I pay to keep myself sealed

Rush, rush
Want this feeling to go away so I rush-
To heal, the pain, so I cry 'til I blush
Please, I've always been known as ugly crier
Can't admit that I'm tired

Color grade my lenses through a kodak
Cause you got me so nostalgic but you know that
Got my head on my shoulder, so please cut some slack
This self-sabotaging, what did I even get at
Touched by an Angel, I still want a chance
If I did redeem myself, would you even want me back?
Fantasizing how I might attempt to reach back out again
Or have we passed the terminal phase where we can't be just friends
Did I leave an imprint on your heart
First time laid on your chest until the sunset went dark
And I'll be hurting hard when I imagine you in his arms
It's time to reset, can't level set, I restart

Rush, rush
Want this feeling to go away so I rush-
To heal, the pain, so I cry 'til I blush
Please, I've always been known as ugly crier
Can't admit that I'm tired
Rush, rush
Want this feeling to go away so I rush-
To heal, the pain, so I cry 'til I blush
Please, I've always been known as ugly crier
Can't admit that I'm tired

Touched by an Angel, I still want a chance
If I did redeem myself, would you even want me back?
Fantasizing how I might attempt to reach back out again
Or have we passed the terminal phase where we can't be just friends?`,
    ring: 2,
    releaseDate: "December 29th, 2025",
  },
  {
    title: "Testing",
    slug: "testing",
    audioSrc: "/audio/testing.wav",
    credits: "Prod. michael harrison\nmix, master, lyrics and vocals by me",
    lyrics: `Old ways, same fate
Time could tell that I'm falling over my own shoulders
And when lifting my head up gets hard to endure
Can I still fight this bad thing off
Still not strong to take your love
I try so hard but it's not enough
The fear of seeing you again makes it tough
You're no different then when I buried old friends
I said last time this will be where it ends
But I still self sabotage all over again
I wonder if I'll fight or flight in the moment

Hands up in the air, I surrender up myself to you
Deer in the headlights, in the shell, freezing up to you
Couple of months past and I'm still stuck with the veil of vice
Can I make you see a good side of me with your very eyes
More, I wanted more for myself
Not self aware, couldn't tell I made hell
And when many years go by, will I be stuck in this shell
Not so much, oh yeah, how could you tell so well`,
    ring: 4,
    releaseDate: "December 29th, 2025",
  },
  {
    title: "Trophy Hunting",
    slug: "trophy-hunting",
    audioSrc: "/audio/Trophy Hunting.wav",
    credits: "prod. n999\nmix, master, lyrics and vocals by me",
    lyrics: `Break
You're playing with the heart you'll throw away
Ghost in a shell that decays into waste
I ask why you always wasting my time
Why you in my mind
Why can't you see these scars etched on my lines
My heart's isohel taking you, take my life
I'm saving the world
Saving my nerves

Takes one to know one
P.S. You know that
Tell me how you want it, breakneck
Got you stunned, whiplash
I want my love right back
Want you locked, attached
I want you here right back
Don't ever call me back

Running out in the woods
Injured, but up, as I should
You'd finish me if you could
Say that it's all for my own good
Delicate body, but I fight back rude
Ghost in the shell make you blackout too
Hard-tethered soul, been a God since youth
Ego so tough, but still fall into you

Fall into you
(You designate me as your game)
Fall into you
(You’re trophy hunting me afraid)
Fall into you
(You'd rather sell your soul away)
Fall into you
(Disconnect from the hunt, repent)

I played with my own heart, but you don't wanna hear about it
Can't fix trust issues, but you don't wanna hear about it
Gave the whole world to you, but you'd forget about it
Cause I can't change up your thoughts you said around it
Treading water when I'm around you
Drown, drown, drown, this ain't about you
Free yourself from what you're bound to
What you're bound to

On a new wave again
Don't need you up as my friend
We're so exhausted in this
Wake up to burdened amends
You'll find me lost right here
No way back home, I fear
Guts opaque, to crystal clear
Fragile and fawn-eyed, dear
You were the hunter, and you spotted up your prey
That is me, innocent, with my eyes locked on the gun
I don't beg, I don't plead, I don't pop 'til I bleed
On the leaves, now I'm your trophy that fulfills all your needs`,
    ring: 6,
    releaseDate: "December 29th, 2025",
  },
  {
    title: "Supernova",
    slug: "supernova",
    audioSrc: "/audio/supernova5.wav",
    credits: "Prod. fiftyzero\ninterpolated lyrics from Starset - Telescope\nmix, master, lyrics and vocals by me",
    lyrics: `You don't want me to move
Miss my hands all on you
And we've split up in two
Can't come back, thats the truth
Now it's what we could've done
When we were abundant with love
I still sing our favorite songs
I know its time to move on

Ah, I can't, I can't move on
But surely you'll be proud if I moved along
Why do I perform for you doing all these songs
I got so much love to give, star to supernova
We'll fuse when we collide
Awaking in the light
Of all the stars aligned

You don't want me to move
Miss my hands all on you
And we've split up in two
Can't come back, thats the truth
Now it's what we could've done
When we were abundant with love
I still sing our favorite songs
I know its time to move on

Ah, I can't, I can't move on
But surely you'll be proud if I moved along
Why do I perform for you doing all these songs
I got so much love to give, star to supernova
We'll fuse when we collide
Awaking in the light
Of all the stars aligned`,
    ring: 3,
    releaseDate: "December 30th, 2025",
  },
  {
    title: "Samsara (City Lights) [DEMO]",
    slug: "samsara-city-lights-demo",
    audioSrc: "/audio/Samsara (City Lights) DEMO.wav",
    credits: "Prod. fiftyzero\nMix, master, lyrics and vocals by me",
    lyrics: `Take a look in my eyes
Close yourself deep inside
Take a look at this city that you grew to despise
And I hang like a knife
That you'd put up to fight
What is with this city
That makes you just lose your mind

Thought it was over but you just wanted more
Spilled all my guts and exposed all my lore
Why you telling me that this shook up to your core
Maybe we are both tired, our hearts' been up and sore
Baby lets go out, light a fire, set a blaze
Go off to the city, live cliche but better days
It's getting mundane, samsara, be all the same
There's a better way, but I've yet to know your name 
Aim for the heart
Cyclic parts in the dark
Would this love even start
Leave my claim, leave a mark
You said you hate my guts
Said from your chest, not loud enough
But when we wake, it's gon' restart
Crawl for it back, crawl for my heart

And when I come around, by morning time, you'll ask me where we've been
When I show you pics, from us all outside, you'll ask me if we can do it again 

So let's go escape tonight
Will you be out by nine
I'm finna make you mine
You can make me all alright

Take a look in my eyes
Close yourself deep inside
Take a look at this city that you grew to despise
And I hang like a knife
That you'd put up to fight
What is with this city
That makes you just lose your mind

Your body on mine
Yearn this every night
I'm losing my mind
I am trying be inside
And so for tonight
You'll love it this time
And so for tonight
You'll love it this time`,
    ring: 5,
    releaseDate: "December 31st, 2025",
  },
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.slug === slug);
}

export function getAllSlugs(): string[] {
  return songs.map((song) => song.slug);
}
