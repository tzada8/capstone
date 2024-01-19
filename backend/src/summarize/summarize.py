from openai import OpenAI
from os import environ
from typing import List

# EXAMPLE_INPUT = [
#     "In this case it's a matter of you get what you pay for. If you looking for a camera to further your career then this isn't it. If you looking for a camera to get your feet wet , something to practice with to perfect your talent or craft or do small self tapes, audition tapes, blogs/vlogs, then this is great for those purchases.  Below are some photos I took outdoor. Also lighting/ time of day please an important part when using this camera to take photos.",
#     "i was disappointed to realize that all the stuff that is shown with the camera was not part of the entire package just to get you to buy the camera and extra money for a case to hold the camera I feel that was fake advertising just to sell the product",
#     "I just got this camera in today, and it came with the wrong charging cable. So inconvenient. And the couple sample pics I took are not very good quality. My iPhone takes better pics",
#     "The camera quality is really bad if I wanted this quality I would probably buy a normal camera that's 50 dollars but this one is very expensive for very poor quality",
#     "I am sorry but I am very disappointed with the camera. I charged the battery and put it in. It didn't come on so I tried to put in Sim card and I guess I put it in wrong and it disappeared in the camera somewhere. So I tried to take battery out the flap fell off. Now I am not the smartest person but, I have had cameras before and never had a problem.",
#     "This is not a nbd camera,it is a apex",
#     "Sent seller email stating incorrect charging cable supplied with camera.  Seller replied with verbiage telling me how and where to connect charging cable. I  have not been able to use camera since I refuse to buy the charging cable that should have been provided.",
#     "On camera I received, area near microSD card slot had open gaps.  When inserting the tiny card to test camera, card slid down the side (gap) and is now bouncing around loose inside camera.  Who makes a '$500' camera with open gaps near a SDcard slot?!?!  China does!",
#     "Zero stars on this one. Can't take a clear pic but that might because nothing in the view screen is clear either. Trying with the wide angle lens makes the whole thing worse. Expensive piece of junk. Going back today!! Beware, read other reviews.  It even feels small and cheap. So disappointed. I bought this to use at my daughter's wedding. No re-takes on that one!!",
#     "This camera takes worst pictures in a 2007 android! Very pixelated horrific. I bought it for my daughter's graduation and there is not a single usable picture! I am sad and horrified all at the same time. In all honesty, I would return it for my money back.",
#     "Purchased because it's a good price point and I wanted to get back into photography. I was skeptical, especially with the reviews, but still decided to purchase. I probably should've followed my first mind. The quality is horrible and won't really be of much use to me. I'll unfortunately be sending it back. This may be okay for someone starting out and just wanting to capture some pictures. It's just not for me. I'd be better off using my iPhone.",
#     "Pictures were not very great, definitely not \u201c4K\u201d quality. I feel my phone takes better quality pictures honestly. Camera does not do well in low light at all. Is very hit or miss with focusing so very unreliable in moments where you'd like to snap a quick candid as you have a 50/50 shot it will not focus in time it at all. Overall the camera and settings look and feel cheap. I got it in Black Friday for 120 and didn't feel it was even with that, and \u201cregular price\u201d is 300. Ended up returning and wish I would have paid extra for a quality name brand while it was on sale.",
#     "The camera was broken right out of the box.  no product support. The camera seemed to have great potential. The product setup was lengthy and lacked a\nwall adapter to plug the USB-C cable into the wall which required me to make a second purchase at another store.",
#     "It need a fold out easy operation sheet the manual is to deep ,And after you take the picture you have to go to a different setting to view the pictures  because after you take a picture the screen go back to blank and you can't see the picture until you go to the other setting.",
#     "said it had wifi capabilities you CANNOT CONNECT IT YOUR OHONE VIA WIFI!!!\nHas the worst pixelation ive ever seen for pictures....\n one pro with this camera is the timelapses but even then quality is shotty.\nbought this as my first camera and i wish i would had just aved a few more hundred and biught a canon",
#     "So, it's an ok camera. Just be aware that on the LCD screen, it doesn't zoom in on pics you've already taken, the focus is slow at best, if at all. The button to snap the pic will have to be pressed for what seems like an extended period of time for the picture to be taken. It comes with SD card compatibility, so that's nice. It also came with a nice leather pouch to carry the camera in.",
#     "I ordered this for creative video making and as soon as I got it out of the box it was super light and cheap feeling. The graphics on there are obviously generic and nothing branded. The quality of the camera was garbage as well. Save your time and look into other options. I returned it immediately.",
#     "It's not a bad camera for beginners. it works great with a bunch of light but in darker areas it struggles to focus. I would not buy again in my opinion. Once you zoom past Half way pixels are present. You have to take a couple photos to get one good one.",
#     "does not look anything like the picture and does not come with anything pictured either, a little disappointed",
#     "I'd love to tell you about the camera, but I'll have to wait until AFTER I purchase a receive a correct charging cord.  The provided charging cable doesn't fit the camera OR the battery dock.  Beyond annoying."
# ]
# EXAMPLE OUTPUT FROM RUN:
# Overall, the reviews for this camera are mixed. Some reviewers found it to be a good budget option for beginners
# or casual use, while others were disappointed with the poor quality and lack of accessories. Common issues mentioned
# include incorrect charging cables, low picture quality, difficulty with focus and low-light situations, and cheap
# construction. Many reviewers expressed frustration with the camera not meeting their expectations and planned to
# return it.


# EXAMPLE_INPUT = [
#     "This product stinks",
#     "One of the best purchases I ever made",
#     "I was wondering why it was so expensive, but after purchasing, I know it was definitely worth my money",
#     "I'mm stll lrning to tpe, but my fvorite prodct ever",
#     "4.5 stars? How is that possible. Should have a negative rating",
# ]
# EXAMPLE OUTPUT FROM RUN:
# The overall sentiment of the product reviews is mixed. Some users expressed disappointment and dissatisfaction,
# describing the product as bad or questioning its high price. On the other hand, there are positive reviews stating
# that the product is one of the best purchases they have made, and that it is worth the money invested. Another comment
# mentioned that the product is the user's favorite, despite their struggles with typing. However, there is also a critique
# regarding the rating of the product, suggesting that it should have received a negative rating instead of 4.5 stars.


# NOTE: Average usage should be around 250 input and 1750 output tokens, which is around $0.0040/call.
def summarize(reviews: List[str]) -> str:
    if len(reviews) == 0:
        return "Product has no reviews."

    client = OpenAI(api_key=environ.get("OPENAI_API_KEY"))
    # TODO: Maybe can add more to prompt (e.g. "using at most 100 words").
    bullet_reviews = "\n- ".join(reviews)
    prompt = f"Summarize and aggregate the following list of product reviews into 1 paragraph:\n- {bullet_reviews}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()
