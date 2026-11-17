// The Business Growth Blueprint — content. One entry per A4 page.
// Rendered to public/the-business-growth-blueprint.pdf by ../build-blueprint.mjs

const opener = (no, title, question, inside) => ({
  cls: "opener",
  html: `
  <div class="no">${no}</div>
  <div class="kicker">Chapter ${no}</div>
  <div class="big">${title}</div>
  <p class="q">${question}</p>
  <ul class="in">${inside.map((t, i) => `<li><span>${no}.${i + 1}</span>${t}</li>`).join("")}</ul>`,
});

const sys = `
<svg class="sys" viewBox="0 0 480 300" fill="none">
  <path d="M30 250 C 110 250, 110 170, 190 170 S 270 90, 350 90 S 420 40, 462 40" stroke="#00c551" stroke-width="3"/>
  <path d="M30 250 H 462 M30 170 H 462 M30 90 H 462" stroke="#ffffff" stroke-opacity=".08"/>
  <g fill="#0a0c0a" stroke="#fff" stroke-width="2.4">
    <circle cx="30" cy="250" r="9"/><circle cx="190" cy="170" r="9"/><circle cx="350" cy="90" r="9"/>
  </g>
  <circle cx="462" cy="40" r="11" fill="#00c551"/>
  <g font-family="IBM Plex Mono" font-size="10" fill="#8d958d" letter-spacing="1.6">
    <text x="20" y="278">ATTRACT</text><text x="168" y="198">CONVERT</text><text x="322" y="118">FOLLOW UP</text><text x="404" y="20">GROW</text>
  </g>
</svg>`;

export const pages = [
  /* 1 ─ Cover */
  {
    cls: "cover",
    bare: true,
    html: `
    <div class="brand"><img src="LOGO_SRC" alt=""><span>SYNERGOX</span></div>
    <div class="tag">A field guide for business owners</div>
    <h1>The Business <em>Growth</em> Blueprint</h1>
    <p class="sub">Discover the hidden marketing and conversion problems costing your business customers — and learn how to build a system that turns more opportunities into revenue.</p>
    ${sys}
    <div class="foot"><span>SYNERGOX<br>Growth systems for ambitious businesses</span><span>synergox.co</span></div>`,
  },

  /* 2 ─ Read this first */
  {
    html: `
    <div class="kicker">Read this first</div>
    <h2>How to get the most from the next <em>twenty minutes</em></h2>
    <p class="lead">This guide is short on purpose. It exists to help you find the one part of your marketing that is costing you the most customers, and to show you what to do about it.</p>
    <p>You can read it straight through. But if you're busy, and you are, use it like this:</p>
    <ol class="steps">
      <li><strong>Start at the back.</strong> The scorecard on pages 20–21 takes five minutes and tells you which of the four parts of your growth system is weakest.</li>
      <li><strong>Read that chapter first.</strong> Every chapter ends with something you can fix this week without hiring anyone.</li>
      <li><strong>Then read chapter 5.</strong> It explains why fixing the parts in the right order matters more than how well any single part is done.</li>
    </ol>
    <div class="box">
      <div class="label" style="margin-bottom:4mm">What's inside</div>
      <table style="margin:0">
        <tr><td>1 &nbsp; Why your marketing isn't producing results</td><td class="n">04</td></tr>
        <tr><td>2 &nbsp; Why visitors don't become customers</td><td class="n">07</td></tr>
        <tr><td>3 &nbsp; The offer problem</td><td class="n">10</td></tr>
        <tr><td>4 &nbsp; The broken acquisition process</td><td class="n">13</td></tr>
        <tr><td>5 &nbsp; How the parts work together</td><td class="n">16</td></tr>
        <tr><td>6 &nbsp; Your next thirty days</td><td class="n">19</td></tr>
        <tr><td>The Growth System Scorecard</td><td class="n">20</td></tr>
        <tr><td style="border-bottom:0">Worksheet: your numbers</td><td class="n" style="border-bottom:0">22</td></tr>
      </table>
    </div>
    <p>One request. Don't just read it. Write in it. The pages with blanks are the ones that pay.</p>`,
  },

  /* 3 ─ Introduction */
  {
    html: `
    <div class="kicker">Introduction</div>
    <h2>You already paid for <em>these customers</em></h2>
    <p class="lead">Somewhere in your business right now there are people who saw your advert, visited your website, even sent you a message, and then bought from someone else, or from no one.</p>
    <p>You paid to reach every one of them. With ad spend, with time, with the effort it took to earn a referral. The money left your account. The customer never arrived.</p>
    <p>When this happens, the natural conclusion is that you need more: more traffic, more posts, more budget. It feels right, and it is usually wrong. If a bucket has a hole in it, a bigger tap fills it no faster. It just costs more to run.</p>
    <div class="pull">Most growing businesses do not have a traffic problem. They have a leak, and they are paying to pour water through it.</div>
    <p>The good news in that sentence is easy to miss. A leak means the demand already exists. People are already interested enough to click, to visit, to ask. You don't have to create that from nothing. You have to stop losing it.</p>
    <p>That is a cheaper problem than the one you thought you had. Finding more strangers costs money every single time. Converting more of the strangers you have already reached costs effort once, and then keeps paying.</p>
    <h3>What this guide will and won't do</h3>
    <p>It will show you how to find where customers are dropping out, why they drop out at each point, and what a business that doesn't leak looks like.</p>
    <p>It won't promise you a number. Anyone who guarantees a revenue figure without knowing your prices, your market and your delivery is selling confidence, not marketing. What we can promise is that you will finish this guide knowing exactly where to look.</p>`,
  },

  /* 4 ─ Chapter 1 opener */
  opener(
    "1",
    "Why your marketing isn't <em>producing results</em>",
    "You're doing the things you were told to do. You post. You run adverts. You have a website. So why doesn't it add up to customers?",
    ["Marketing is a chain, not a list of activities", "The maths of a leaking funnel", "How to find your weakest stage in ten minutes"]
  ),

  /* 5 ─ Chapter 1: the chain and the maths */
  {
    html: `
    <div class="kicker">Chapter 1 · The chain</div>
    <h2>Marketing is a chain, not a <em>list</em></h2>
    <p>Most businesses treat marketing as a list of activities: a website, some social media, a few ads. Each gets judged on its own. The website "looks good". The ads "got clicks".</p>
    <p>But a customer doesn't experience a list. They go through a sequence, and every step depends on the one before it:</p>
    <div class="flow">
      <div><b>Attract</b>Someone who could buy becomes aware of you.</div>
      <div><b>Visit</b>They land on a page to find out more.</div>
      <div><b>Enquire</b>They take a step: a call, a form, a message.</div>
      <div><b>Buy</b>They become a paying customer.</div>
    </div>
    <p>A chain is only as strong as its weakest link. If one stage loses most of the people who reach it, improving any <em>other</em> stage changes very little.</p>
    <h3>The maths of a leaking funnel</h3>
    <p>Here is an illustrative business. The figures are invented to show the arithmetic; yours will be different.</p>
    <table>
      <tr><th>Stage</th><th class="n">People</th><th class="n">Moved on</th></tr>
      <tr><td>Visitors to the website this month</td><td class="n">2,000</td><td class="n">—</td></tr>
      <tr><td>Made an enquiry</td><td class="n">40</td><td class="n">2%</td></tr>
      <tr><td>Got a reply and a real conversation</td><td class="n">24</td><td class="n">60%</td></tr>
      <tr class="total"><td>Became customers</td><td class="n">6</td><td class="n">25%</td></tr>
    </table>
    <p>Two thousand people showed interest. Six bought. Now watch what happens if this business doubles its advertising, compared with fixing the weakest stage.</p>
    <div class="cols">
      <div class="box" style="margin:0"><div class="label" style="margin-bottom:3mm">Option A · Double the traffic</div><p><strong>4,000 visitors → 12 customers.</strong><br>Six more customers, and the advertising bill doubles every month from now on.</p></div>
      <div class="box dark" style="margin:0"><div class="label" style="margin-bottom:3mm;color:#00c551">Option B · Fix the page</div><p><strong>2,000 visitors, 4% enquire → 12 customers.</strong><br>The same six extra customers, on the budget already being spent.</p></div>
    </div>`,
  },

  /* 6 ─ Chapter 1: finding the leak */
  {
    html: `
    <div class="kicker">Chapter 1 · Find it</div>
    <h2>Find your weakest stage in <em>ten minutes</em></h2>
    <p>You need three numbers from last month. Estimates are fine. If you can't find one of them at all, that is your first finding: you can't fix what you can't see.</p>
    <ol class="steps">
      <li><strong>Visitors.</strong> How many people visited your website or main page? (Your website analytics, or your ad platform's "landing page views".)</li>
      <li><strong>Enquiries.</strong> How many people contacted you: forms, calls, direct messages, WhatsApp chats?</li>
      <li><strong>Customers.</strong> How many of those people paid you?</li>
    </ol>
    <p>Now divide each number by the one before it.</p>
    <div class="box">
      <table style="margin:0">
        <tr><th>Your rate</th><th>Work it out</th><th class="n">Result</th></tr>
        <tr><td>Visitor → enquiry</td><td>Enquiries ÷ visitors × 100</td><td class="n"><span class="fill"></span> %</td></tr>
        <tr><td style="border-bottom:0">Enquiry → customer</td><td style="border-bottom:0">Customers ÷ enquiries × 100</td><td class="n" style="border-bottom:0"><span class="fill"></span> %</td></tr>
      </table>
    </div>
    <h3>How to read the result</h3>
    <ul class="dash">
      <li><strong>Very few visitors become enquiries.</strong> The page is the problem: it isn't clear what you offer, who it's for, or what to do next. Go to chapter 2, then chapter 3.</li>
      <li><strong>Plenty of enquiries, few customers.</strong> The problem is after the click: slow replies, no follow-up, or the wrong people enquiring. Go to chapter 4.</li>
      <li><strong>Both look healthy, but there aren't enough visitors.</strong> Now, and only now, more traffic is the right answer. Go to chapter 5 for the order to do it in.</li>
      <li><strong>You couldn't fill in the boxes.</strong> Start with tracking. Chapter 4 covers the minimum you need.</li>
    </ul>
    <div class="pull">The stage with the smallest percentage is where the money is. Fix that one first, and leave everything else alone until you have.</div>
    <p><strong>This week:</strong> write your three numbers on the worksheet on page 22. Put a date next to them. You'll want to compare in thirty days.</p>`,
  },

  /* 7 ─ Chapter 2 opener */
  opener(
    "2",
    "Why visitors don't become <em>customers</em>",
    "People are arriving. They look around for a few seconds, and they leave. Here is what's happening in those seconds.",
    ["The five-second test your page has to pass", "Five reasons a page gets visits and no enquiries", "The order a converting page is built in"]
  ),

  /* 8 ─ Chapter 2: five-second test and reasons */
  {
    html: `
    <div class="kicker">Chapter 2 · The page</div>
    <h2>The <em>five-second</em> test</h2>
    <p>A new visitor decides very quickly whether they're in the right place. Not whether to buy. Just whether to keep reading. In that time your page has to answer three questions without being asked:</p>
    <div class="cols3">
      <div class="box" style="margin:0"><h3>What is this?</h3><p>What you sell, in the words a customer would use.</p></div>
      <div class="box" style="margin:0"><h3>Is it for me?</h3><p>Who it's for, and what problem it solves for them.</p></div>
      <div class="box" style="margin:0"><h3>What do I do?</h3><p>One obvious next step, visible without scrolling.</p></div>
    </div>
    <p style="margin-top:5mm"><strong>Try it.</strong> Show your homepage to someone who doesn't know your business. Count to five and close the laptop. Ask them the three questions. Whatever they can't answer is what your visitors can't answer either.</p>
    <h3>Five reasons a page gets visits and no enquiries</h3>
    <ol class="steps">
      <li><strong>It talks about the company, not the customer.</strong> "Established in 2011, we are a leading provider of…" tells a visitor nothing about their own problem. Lead with what changes for them.</li>
      <li><strong>It asks for nothing, or for everything.</strong> No clear next step, or six competing ones. A page should have one job.</li>
      <li><strong>It gives no reason to believe.</strong> Claims with no proof: no examples, no specifics, no evidence that you've done this before.</li>
      <li><strong>It's slow or awkward on a phone.</strong> Most visitors arrive on mobile data. If the page takes long to load or the button is hard to tap, they're gone before they've read a word.</li>
      <li><strong>The step it asks for is too big.</strong> "Buy now" for a considered purchase, or a twelve-field form for a first enquiry. Match the size of the ask to the amount of trust you've earned so far.</li>
    </ol>
    <p>None of these is about how the page looks. A page can be beautiful and fail all five.</p>`,
  },

  /* 9 ─ Chapter 2: anatomy */
  {
    html: `
    <div class="kicker">Chapter 2 · The fix</div>
    <h2>The order a converting page is <em>built in</em></h2>
    <p>Good pages follow the order of the questions in a buyer's head. Each section answers the question the previous one raised. If you rearrange nothing else, rearrange your page into this sequence:</p>
    <table>
      <tr><th style="width:9mm">#</th><th style="width:42mm">Section</th><th>The question it answers</th></tr>
      <tr><td class="n" style="text-align:left">01</td><td><strong>Headline + next step</strong></td><td>What is this, and what do I do about it?</td></tr>
      <tr><td class="n" style="text-align:left">02</td><td><strong>The problem</strong></td><td>Do you understand my situation?</td></tr>
      <tr><td class="n" style="text-align:left">03</td><td><strong>The solution</strong></td><td>What would you actually do for me?</td></tr>
      <tr><td class="n" style="text-align:left">04</td><td><strong>Proof</strong></td><td>Has this worked for anyone like me?</td></tr>
      <tr><td class="n" style="text-align:left">05</td><td><strong>The offer</strong></td><td>What exactly do I get, and what does it cost?</td></tr>
      <tr><td class="n" style="text-align:left">06</td><td><strong>Objections</strong></td><td>What about the thing I'm worried about?</td></tr>
      <tr><td class="n" style="text-align:left;border-bottom:0">07</td><td style="border-bottom:0"><strong>The next step, again</strong></td><td style="border-bottom:0">I'm convinced. Where do I go?</td></tr>
    </table>
    <div class="box dark">
      <h3>One page, one job</h3>
      <p>Your homepage has to serve everyone: customers, job applicants, suppliers, the curious. That's why it converts poorly, and why you shouldn't send paid traffic to it. A <strong>landing page</strong> is a page with one audience, one offer and one button. Every visitor you pay for should land on one.</p>
    </div>
    <h3>Check your page against this</h3>
    <p><span class="tick"></span>The headline says what a customer gets, not what the company is.</p>
    <p><span class="tick"></span>There is one main button, and it appears before any scrolling.</p>
    <p><span class="tick"></span>There is at least one specific piece of proof: a real example, a named client, a number.</p>
    <p><span class="tick"></span>The page loads in a few seconds on a phone using mobile data.</p>
    <p><span class="tick"></span>The form asks only for what you need to reply.</p>
    <p style="margin-top:4mm"><strong>This week:</strong> run the five-second test on your main page with three people outside the business. Rewrite the headline based on what they couldn't tell you.</p>`,
  },

  /* 10 ─ Chapter 3 opener */
  opener(
    "3",
    "The <em>offer</em> problem",
    "Sometimes the page is clear, the traffic is right, and people still don't act. That's usually not a marketing problem. It's what you're asking them to say yes to.",
    ["Why a weak offer can't be fixed with better advertising", "The four parts of an offer people act on", "A fill-in-the-blanks rewrite of your own"]
  ),

  /* 11 ─ Chapter 3: anatomy of an offer */
  {
    html: `
    <div class="kicker">Chapter 3 · The offer</div>
    <h2>An offer is not a <em>price list</em></h2>
    <p>Ask most businesses what their offer is and they'll describe a service and a fee: "Website design, from ₦150,000." That's a product and a price. It isn't an offer.</p>
    <p>An offer is the whole proposition a customer weighs up: what they'll get, why they should believe it, what could go wrong, and what happens when they say yes. When any of those is missing, the customer fills the gap themselves, and they fill it with doubt.</p>
    <p>This matters because <strong>the offer sets the ceiling for everything else.</strong> Better adverts bring more people to see it. A better page explains it more clearly. Neither can make people want something that hasn't been made worth wanting.</p>
    <h3>The four parts of an offer people act on</h3>
    <table>
      <tr><th style="width:32mm">Part</th><th>What it says</th><th style="width:58mm">Weak version</th></tr>
      <tr><td><strong>The outcome</strong></td><td>The specific result the customer is buying, in their words.</td><td>"Quality service"</td></tr>
      <tr><td><strong>The proof</strong></td><td>Evidence it works: an example, a method, a track record.</td><td>"Trusted by many clients"</td></tr>
      <tr><td><strong>The risk</strong></td><td>What you'll do if it goes wrong, and what's clearly included.</td><td>Silence</td></tr>
      <tr><td style="border-bottom:0"><strong>The next step</strong></td><td style="border-bottom:0">Exactly what happens after they say yes, and how soon.</td><td style="border-bottom:0">"Contact us"</td></tr>
    </table>
    <div class="pull">People don't compare your price with your competitor's price. They compare your price with how sure they are about what they'll get.</div>
    <h3>Three signs your offer is the bottleneck</h3>
    <ul class="dash">
      <li>Prospects say "let me think about it" and never return, and price is the reason they give.</li>
      <li>You win work mainly by being cheaper, or by discounting at the last moment.</li>
      <li>Your enquiries ask the same basic questions every time: what's included, how long, what if.</li>
    </ul>
    <p>Each of those questions is something your offer should already have answered.</p>`,
  },

  /* 12 ─ Chapter 3: rewrite */
  {
    html: `
    <div class="kicker">Chapter 3 · The rewrite</div>
    <h2>Rewrite your offer in <em>four lines</em></h2>
    <p>Here is the same service described twice. Nothing about the work has changed. Only how completely it's been explained.</p>
    <div class="cols">
      <div class="box" style="margin:0">
        <div class="label" style="margin-bottom:3mm">Before</div>
        <p><strong>"Professional website design for your business. Affordable packages. Contact us for a quote."</strong></p>
        <p>What do I get? How long does it take? What does it cost? What if I don't like it? Every answer is left to the buyer's imagination.</p>
      </div>
      <div class="box dark" style="margin:0">
        <div class="label" style="margin-bottom:3mm;color:#00c551">After</div>
        <p><strong>"A six-page website that turns visitors into enquiries, live in three weeks. Fixed price, two rounds of revisions included, and you own everything from day one. Start with a ten-minute brief."</strong></p>
      </div>
    </div>
    <h3>Now yours</h3>
    <p>Fill in each line. Use the words your customers use when they describe the problem to you, not the words your industry uses.</p>
    <div class="box">
      <p><span class="label">The outcome</span><br>You get <span class="fill" style="min-width:118mm"></span></p>
      <p><span class="label">The proof</span><br>You can trust that because <span class="fill" style="min-width:96mm"></span></p>
      <p><span class="label">The risk</span><br>It includes <span class="fill" style="min-width:52mm"></span> and if <span class="fill" style="min-width:46mm"></span></p>
      <p><span class="label">The next step</span><br>To start, you <span class="fill" style="min-width:56mm"></span> and then <span class="fill" style="min-width:40mm"></span></p>
    </div>
    <h3>Be specific about the edges</h3>
    <p>A strong offer says what is <em>not</em> included as plainly as what is. "Unlimited" and "everything you need" sound generous and read as vague. "Up to six pages, two rounds of revisions" sounds limited and reads as trustworthy, because the buyer can see exactly what they're paying for.</p>
    <p><strong>This week:</strong> put your four lines at the top of your main page and in the first message you send to a new enquiry. Watch what happens to the questions people ask.</p>`,
  },

  /* 13 ─ Chapter 4 opener */
  opener(
    "4",
    "The broken <em>acquisition</em> process",
    "You're reaching people. Some of them are even interested. And still the path from stranger to customer keeps snapping in the same three places.",
    ["The three breaks between an advert and a sale", "What to send after someone enquires, and when", "The one number that makes every decision easier"]
  ),

  /* 14 ─ Chapter 4: three breaks */
  {
    html: `
    <div class="kicker">Chapter 4 · The breaks</div>
    <h2>Three places the path <em>snaps</em></h2>
    <p>Customer acquisition isn't one activity. It's a relay, and customers get dropped at the handovers.</p>
    <h3>Break 1 · Between the advert and the page</h3>
    <p>The advert promises one thing. The page it leads to opens with something else. The visitor wonders if they clicked the wrong link, and leaves.</p>
    <p>The fix is called <strong>message match</strong>: the page repeats the promise of the advert, in the same words, in its headline. An advert about "same-day delivery in Abuja" should land on a page that says "same-day delivery in Abuja", not on a homepage that says "Welcome".</p>
    <h3>Break 2 · Between the page and the enquiry</h3>
    <p>The visitor is interested but the page makes acting difficult: a long form, a phone number that's only answered in office hours, a "contact us" link buried in the footer. Interest fades quickly. Make the first step small, obvious and possible at any hour.</p>
    <h3>Break 3 · Between the enquiry and the sale</h3>
    <p>This is the expensive one, because by now you've paid for everything that came before it. Someone asked a question. They got a reply the next afternoon, or a price with no context, or nothing after the first message.</p>
    <div class="box dark">
      <h3>Speed is part of the offer</h3>
      <p>An enquiry is at its warmest in the first minutes after it's sent. The person is on their phone, thinking about the problem, often messaging two or three businesses at once. The first helpful reply usually sets the terms of the conversation. If you can't reply personally within the hour, set up an automatic reply that says when you will, and answers the most common first question.</p>
    </div>
    <h3>Are you attracting the right people?</h3>
    <p>If you get plenty of enquiries and almost none can afford you, or need what you sell, the targeting or the message is too broad. A smaller number of the right people is worth more than a crowd. Say who it's for, and what it costs to start, earlier.</p>`,
  },

  /* 15 ─ Chapter 4: follow-up and CAC */
  {
    html: `
    <div class="kicker">Chapter 4 · Follow-up</div>
    <h2>Most sales happen after the <em>first</em> reply</h2>
    <p>Very few people buy the first time they enquire about anything that matters. They're comparing, they got busy, they needed to ask someone. "Not now" is rarely "no". But most businesses send one reply and then wait.</p>
    <p>A simple follow-up plan, used every time, is one of the cheapest improvements you can make. Something like this:</p>
    <table>
      <tr><th style="width:26mm">When</th><th style="width:44mm">What you send</th><th>Why</th></tr>
      <tr><td><strong>Within the hour</strong></td><td>A helpful, specific answer</td><td>You're one of several they've messaged. Be the useful one.</td></tr>
      <tr><td><strong>Day 2</strong></td><td>A relevant example</td><td>Show you've solved this before, for someone like them.</td></tr>
      <tr><td><strong>Day 4</strong></td><td>Their likely objection, answered</td><td>Deal with the worry they haven't said out loud.</td></tr>
      <tr><td><strong>Day 7</strong></td><td>A clear, easy next step</td><td>Make saying yes simple.</td></tr>
      <tr><td style="border-bottom:0"><strong>Day 14</strong></td><td style="border-bottom:0">A polite last check-in</td><td style="border-bottom:0">Close the loop, and leave the door open.</td></tr>
    </table>
    <p>Five messages, written once and reused. Whether you send them by hand, by email or through WhatsApp matters much less than sending them at all.</p>
    <h3>The one number that makes decisions easier</h3>
    <p><strong>Cost per customer</strong> is what you spent on marketing in a month, divided by the customers it produced.</p>
    <div class="box">
      <p style="font:500 11pt/1.6 var(--mono);color:var(--ink)">Marketing spend ÷ new customers = cost per customer</p>
      <p>Illustration: ₦300,000 spent, 6 customers won. Each one cost ₦50,000. If a customer is worth ₦200,000 to you, that's a machine worth feeding. If a customer is worth ₦40,000, no amount of extra advertising will make it work until something earlier in the chain is fixed.</p>
    </div>
    <p>Once you know this number, "should we spend more on ads?" stops being an opinion. To know it, you need three things in place: analytics on your website, tracking on your adverts, and a note of where every enquiry came from.</p>
    <p><strong>This week:</strong> write your five follow-up messages. Then ask your next ten enquiries how they found you, and write it down.</p>`,
  },

  /* 16 ─ Chapter 5 opener */
  opener(
    "5",
    "How the parts <em>work together</em>",
    "A website, advertising, landing pages and conversion optimization are usually bought separately, from different people, at different times. That's exactly why they underperform.",
    ["What each of the four parts is actually for", "Why the gaps between them cost more than the parts", "The order to build in: Discover, Strategize, Build, Acquire, Optimize"]
  ),

  /* 17 ─ Chapter 5: four parts */
  {
    html: `
    <div class="kicker">Chapter 5 · The system</div>
    <h2>Four parts, <em>one</em> job</h2>
    <p>Each part of your marketing has a specific role. Problems start when one is asked to do another's work: a homepage expected to convert cold traffic, or advertising expected to fix an unclear offer.</p>
    <table>
      <tr><th style="width:38mm">Part</th><th>Its job</th><th style="width:52mm">It can't do this alone</th></tr>
      <tr><td><strong>Website</strong></td><td>Makes you credible. Answers "are these people real, and are they any good?"</td><td>Bring in new visitors.</td></tr>
      <tr><td><strong>Advertising</strong></td><td>Puts the right offer in front of the right people, on demand.</td><td>Persuade anyone to buy.</td></tr>
      <tr><td><strong>Landing pages</strong></td><td>Turn one specific audience into enquiries for one specific offer.</td><td>Find their own traffic.</td></tr>
      <tr><td style="border-bottom:0"><strong>Conversion optimization</strong></td><td style="border-bottom:0">Finds where people drop out, and fixes the stage losing the most.</td><td style="border-bottom:0">Work without visitors to measure.</td></tr>
    </table>
    <p>Look at the right-hand column. Every part depends on another to be worth anything. That's what makes this a system rather than a set of services.</p>
    <div class="flow">
      <div><b>Advertising</b>finds the people</div>
      <div><b>Landing page</b>makes the case</div>
      <div><b>Website</b>earns the trust</div>
      <div><b>Optimization</b>improves every step</div>
    </div>
    <h3>The gaps cost more than the parts</h3>
    <p>When four different suppliers each deliver one part, everybody does their job and nobody is responsible for the result. The designer delivered a website. The advertiser delivered clicks. The customer fell through the space between them, and that space isn't in anyone's contract.</p>
    <div class="pull">The question isn't "which service do I need next?" It's "who is responsible for the whole path a customer walks?"</div>
    <p>That person can be you. It can be one member of your team, or one partner. What matters is that someone looks at the chain from end to end, and that the parts are planned together even if they're built one at a time.</p>`,
  },

  /* 18 ─ Chapter 5: order */
  {
    html: `
    <div class="kicker">Chapter 5 · The order</div>
    <h2>Build it in <em>this order</em></h2>
    <p>Most disappointing marketing isn't bad work. It's good work done in the wrong sequence. Here is the order we use at SYNERGOX, and why each step comes where it does.</p>
    <table>
      <tr><th style="width:9mm">#</th><th style="width:30mm">Step</th><th>What happens</th></tr>
      <tr><td class="n" style="text-align:left">01</td><td><strong>Discover</strong></td><td>Look at the numbers and the current path. Find the stage losing the most customers before touching anything.</td></tr>
      <tr><td class="n" style="text-align:left">02</td><td><strong>Strategize</strong></td><td>Decide who you're talking to, what the offer is, and which page and channel will carry it. Write it down.</td></tr>
      <tr><td class="n" style="text-align:left">03</td><td><strong>Build</strong></td><td>Make the website or landing page around that one offer and that one action.</td></tr>
      <tr><td class="n" style="text-align:left">04</td><td><strong>Acquire</strong></td><td>Only now, send traffic: campaigns that match the page, with tracking in place from the first click.</td></tr>
      <tr><td class="n" style="text-align:left;border-bottom:0">05</td><td style="border-bottom:0"><strong>Optimize</strong></td><td style="border-bottom:0">Read the data, fix the weakest stage, test the next improvement. Repeat.</td></tr>
    </table>
    <h3>What going out of order looks like</h3>
    <ul class="dash">
      <li><strong>Acquire before Build.</strong> Paying for traffic to a page that can't convert it. The most common and most expensive mistake.</li>
      <li><strong>Build before Strategize.</strong> A handsome website with no clear offer, built around what the company wanted to say.</li>
      <li><strong>Optimize before Acquire.</strong> Testing button colours on a page with forty visitors a month. There's nothing to measure yet.</li>
      <li><strong>Skipping Discover.</strong> Fixing the part that's most visible instead of the part that's most broken.</li>
    </ul>
    <div class="box dark">
      <h3>You don't have to do all five at once</h3>
      <p>Some businesses need a foundation before anything else. Some already have traffic and need the conversion work. The scorecard on the next pages tells you which one you are. What matters is knowing where you stand in the sequence, and not skipping ahead.</p>
    </div>`,
  },

  /* 19 ─ Chapter 6: thirty days */
  {
    html: `
    <div class="kicker">Chapter 6 · What to do next</div>
    <h2>Your next <em>thirty days</em></h2>
    <p class="lead">You can make real progress in a month without spending more on marketing. One focus a week.</p>
    <table>
      <tr><th style="width:22mm">Week</th><th style="width:36mm">Focus</th><th>Do this</th></tr>
      <tr><td><strong>Week 1</strong></td><td>Measure</td><td>Fill in the worksheet on page 22. Install analytics if you have none. Complete the scorecard. Name your weakest stage.</td></tr>
      <tr><td><strong>Week 2</strong></td><td>Offer</td><td>Write your four-line offer (page 12). Put it at the top of your main page and in your first reply to every enquiry.</td></tr>
      <tr><td><strong>Week 3</strong></td><td>Page</td><td>Run the five-second test. Reorder your page to the seven sections on page 9. One main button. Check it on a phone.</td></tr>
      <tr><td style="border-bottom:0"><strong>Week 4</strong></td><td style="border-bottom:0">Follow-up</td><td style="border-bottom:0">Write your five follow-up messages (page 15) and use them on every enquiry. Start recording where each enquiry came from.</td></tr>
    </table>
    <p>At the end of the month, fill in the worksheet again and compare. You're looking for movement in the stage you chose, not perfection everywhere.</p>
    <h3>Then decide how you want to continue</h3>
    <div class="cols">
      <div class="box" style="margin:0"><h3>Do it yourself</h3><p>Keep going with this guide. Fix one stage, measure, move to the next. It works. It takes patience and a few hours a week you may not have.</p></div>
      <div class="box" style="margin:0"><h3>Have it built for you</h3><p>If your time is better spent running the business, SYNERGOX builds each part of the system, or all of it, for a fixed one-time price. Details are on the last page.</p></div>
    </div>
    <h3>Seven things to stop doing this month</h3>
    <ul class="dash">
      <li>Sending paid traffic to your homepage.</li>
      <li>Judging adverts by clicks instead of customers.</li>
      <li>Replying to an enquiry once and waiting.</li>
      <li>Describing your service without saying what's included.</li>
      <li>Changing three things at once, so you never learn which one worked.</li>
      <li>Asking for ten details on a form when you need two.</li>
      <li>Spending more before you know your cost per customer.</li>
    </ul>`,
  },

  /* 20 ─ Scorecard 1 */
  {
    html: `
    <div class="kicker">The Growth System Scorecard</div>
    <h2>Where is your system <em>weakest?</em></h2>
    <p>Twelve statements, three for each part of your growth system. Score each one honestly: <strong>2</strong> if it's true today, <strong>1</strong> if it's partly true, <strong>0</strong> if it isn't. Add up each section.</p>
    <table class="score">
      <tr class="grp"><td colspan="2">A · Your website and pages</td><td class="pts">Score</td></tr>
      <tr><td>01</td><td>A stranger can tell within five seconds what we sell, who it's for and what to do next.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td>02</td><td>Our main page has one clear call to action, visible without scrolling, and it works well on a phone.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td>03</td><td>Paid traffic lands on a page built for that campaign, not on our homepage.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td></td><td style="text-align:right"><span class="label">Section A total (out of 6)</span></td><td class="pts"><span class="fill" style="min-width:14mm"></span></td></tr>

      <tr class="grp"><td colspan="2">B · Your offer</td><td class="pts">Score</td></tr>
      <tr><td>04</td><td>We can state the outcome a customer gets in one sentence, in their words.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td>05</td><td>Our page shows specific proof: real examples, named clients or numbers.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td>06</td><td>A buyer can see exactly what is included, what isn't, and what happens after they say yes.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td></td><td style="text-align:right"><span class="label">Section B total (out of 6)</span></td><td class="pts"><span class="fill" style="min-width:14mm"></span></td></tr>

      <tr class="grp"><td colspan="2">C · Your acquisition and follow-up</td><td class="pts">Score</td></tr>
      <tr><td>07</td><td>We have at least one channel that brings in the right kind of prospect predictably.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td>08</td><td>Every enquiry gets a useful reply within the hour during working hours.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td>09</td><td>People who don't buy straight away hear from us again, on a planned schedule.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td></td><td style="text-align:right"><span class="label">Section C total (out of 6)</span></td><td class="pts"><span class="fill" style="min-width:14mm"></span></td></tr>
    </table>
    <p class="label" style="margin-top:6mm">Continues on the next page →</p>`,
  },

  /* 21 ─ Scorecard 2 */
  {
    html: `
    <div class="kicker">The Growth System Scorecard</div>
    <table class="score" style="margin-top:0">
      <tr class="grp"><td colspan="2" style="padding-top:0">D · Your measurement and optimization</td><td class="pts" style="padding-top:0">Score</td></tr>
      <tr><td>10</td><td>We know how many visitors, enquiries and customers we had last month.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td>11</td><td>We know what a new customer costs us to win, and what one is worth.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td>12</td><td>We change one thing at a time, on purpose, and check whether it helped.</td><td class="pts">0 &nbsp; 1 &nbsp; 2</td></tr>
      <tr><td></td><td style="text-align:right"><span class="label">Section D total (out of 6)</span></td><td class="pts"><span class="fill" style="min-width:14mm"></span></td></tr>
    </table>
    <h2 style="margin-top:9mm">Reading your <em>score</em></h2>
    <p>Your lowest section is where to start. If two are tied, start with the one that comes first in the alphabet: the parts are listed in the order they depend on each other.</p>
    <table>
      <tr><th style="width:38mm">Lowest section</th><th>What it means</th><th style="width:34mm">Read first</th></tr>
      <tr><td><strong>A · Website and pages</strong></td><td>People arrive and can't tell quickly enough that they're in the right place. You need a foundation.</td><td>Chapter 2</td></tr>
      <tr><td><strong>B · Offer</strong></td><td>The page may be clear, but what it asks people to say yes to isn't compelling or complete.</td><td>Chapter 3</td></tr>
      <tr><td><strong>C · Acquisition</strong></td><td>Too few of the right people are finding you, or they're being lost after they enquire.</td><td>Chapter 4</td></tr>
      <tr><td style="border-bottom:0"><strong>D · Measurement</strong></td><td style="border-bottom:0">You have activity but no feedback loop, so nothing improves on purpose.</td><td style="border-bottom:0">Chapters 1 and 5</td></tr>
    </table>
    <div class="cols3" style="margin-top:6mm">
      <div class="box" style="margin:0"><div class="label" style="margin-bottom:2.4mm">Total 0–9</div><h3 style="margin-top:0">Foundation first</h3><p>Hold your advertising budget. Fix sections A and B before paying for another visitor.</p></div>
      <div class="box" style="margin:0"><div class="label" style="margin-bottom:2.4mm">Total 10–17</div><h3 style="margin-top:0">Close the gaps</h3><p>The parts exist. They aren't connected. Work on your lowest section, then chapter 5.</p></div>
      <div class="box dark" style="margin:0"><div class="label" style="margin-bottom:2.4mm;color:#00c551">Total 18–24</div><h3 style="margin-top:0">Ready to scale</h3><p>The system holds. More traffic and steady optimization will now pay back.</p></div>
    </div>`,
  },

  /* 22 ─ Worksheet */
  {
    html: `
    <div class="kicker">Worksheet</div>
    <h2>Your <em>numbers</em></h2>
    <p>Fill this in today, and again in thirty days. Estimates are better than blanks. The point is to see which way each number is moving.</p>
    <table>
      <tr><th>Last month</th><th class="n" style="width:36mm">Today</th><th class="n" style="width:36mm">In 30 days</th></tr>
      <tr><td>Date</td><td class="n"><span class="fill" style="min-width:28mm"></span></td><td class="n"><span class="fill" style="min-width:28mm"></span></td></tr>
      <tr><td><strong>Visitors</strong> to your website or main page</td><td class="n"><span class="fill" style="min-width:28mm"></span></td><td class="n"><span class="fill" style="min-width:28mm"></span></td></tr>
      <tr><td><strong>Enquiries</strong>: forms, calls, messages</td><td class="n"><span class="fill" style="min-width:28mm"></span></td><td class="n"><span class="fill" style="min-width:28mm"></span></td></tr>
      <tr><td><strong>New customers</strong></td><td class="n"><span class="fill" style="min-width:28mm"></span></td><td class="n"><span class="fill" style="min-width:28mm"></span></td></tr>
      <tr><td><strong>Marketing spend</strong>, including ads</td><td class="n"><span class="fill" style="min-width:28mm"></span></td><td class="n"><span class="fill" style="min-width:28mm"></span></td></tr>
      <tr><td><strong>Average value</strong> of a new customer</td><td class="n"><span class="fill" style="min-width:28mm"></span></td><td class="n"><span class="fill" style="min-width:28mm"></span></td></tr>
    </table>
    <h3>Work out</h3>
    <table>
      <tr><th>Measure</th><th>How</th><th class="n" style="width:30mm">Today</th><th class="n" style="width:30mm">In 30 days</th></tr>
      <tr><td>Visitor → enquiry rate</td><td>Enquiries ÷ visitors × 100</td><td class="n"><span class="fill" style="min-width:20mm"></span> %</td><td class="n"><span class="fill" style="min-width:20mm"></span> %</td></tr>
      <tr><td>Enquiry → customer rate</td><td>Customers ÷ enquiries × 100</td><td class="n"><span class="fill" style="min-width:20mm"></span> %</td><td class="n"><span class="fill" style="min-width:20mm"></span> %</td></tr>
      <tr><td>Cost per customer</td><td>Spend ÷ new customers</td><td class="n"><span class="fill" style="min-width:24mm"></span></td><td class="n"><span class="fill" style="min-width:24mm"></span></td></tr>
      <tr><td style="border-bottom:0">Return on each customer</td><td style="border-bottom:0">Average value ÷ cost per customer</td><td class="n" style="border-bottom:0"><span class="fill" style="min-width:20mm"></span> ×</td><td class="n" style="border-bottom:0"><span class="fill" style="min-width:20mm"></span> ×</td></tr>
    </table>
    <div class="box">
      <h3>My weakest stage is</h3>
      <p><span class="fill" style="min-width:150mm"></span></p>
      <h3 style="margin-top:6mm">The one thing I will change this month</h3>
      <p><span class="fill" style="min-width:150mm"></span></p>
      <p><span class="fill" style="min-width:150mm"></span></p>
      <h3 style="margin-top:6mm">Where my scorecard was lowest</h3>
      <p>A <span class="fill" style="min-width:16mm"></span> &nbsp; B <span class="fill" style="min-width:16mm"></span> &nbsp; C <span class="fill" style="min-width:16mm"></span> &nbsp; D <span class="fill" style="min-width:16mm"></span> &nbsp; Total <span class="fill" style="min-width:18mm"></span> / 24</p>
    </div>`,
  },

  /* 23 ─ Quick reference */
  {
    html: `
    <div class="kicker">Quick reference</div>
    <h2>The whole guide on <em>one page</em></h2>
    <p>Print this one and keep it where you make marketing decisions.</p>
    <div class="cols">
      <div>
        <h3>The idea</h3>
        <p>You've already paid to reach more customers than you're getting. Find where they drop out before you pay for more.</p>
        <h3>The chain</h3>
        <p>Attract → Visit → Enquire → Buy. The stage with the lowest percentage is the one to fix. Improving any other stage changes little.</p>
        <h3>The page</h3>
        <ul class="dash">
          <li>Passes the five-second test.</li>
          <li>One audience, one offer, one button.</li>
          <li>Built in the order of the buyer's questions.</li>
          <li>Fast and easy on a phone.</li>
        </ul>
        <h3>The offer</h3>
        <ul class="dash">
          <li>The outcome, in the customer's words.</li>
          <li>Proof it works.</li>
          <li>What's included, what isn't, what if.</li>
          <li>What happens after "yes".</li>
        </ul>
      </div>
      <div>
        <h3>The path</h3>
        <ul class="dash">
          <li>The page repeats the advert's promise.</li>
          <li>The first step is small and always open.</li>
          <li>A reply within the hour.</li>
          <li>Five planned follow-ups, every time.</li>
        </ul>
        <h3>The number</h3>
        <p>Cost per customer = marketing spend ÷ new customers. Compare it with what a customer is worth before deciding to spend more.</p>
        <h3>The four parts</h3>
        <p><strong>Website</strong> earns trust. <strong>Advertising</strong> finds people. <strong>Landing pages</strong> convert them. <strong>Optimization</strong> improves every step. None works alone.</p>
        <h3>The order</h3>
        <p>Discover → Strategize → Build → Acquire → Optimize. Never pay for traffic before the page is ready for it.</p>
      </div>
    </div>
    <div class="pull" style="margin-top:8mm">Fix one stage. Measure. Then fix the next. A growth system is built the way it runs: one connected step at a time.</div>`,
  },

  /* 24 ─ About / next step */
  {
    cls: "cover",
    bare: true,
    html: `
    <div class="brand"><img src="LOGO_SRC" alt=""><span>SYNERGOX</span></div>
    <div class="tag" style="margin-top:34mm">When you'd rather have it built</div>
    <h1 style="font-size:46pt;line-height:.9">You have the plan. We can <em>build it</em> with you.</h1>
    <p class="sub" style="max-width:150mm">SYNERGOX is a growth and marketing agency. We build the parts of the system described in this guide, and connect them, for a fixed one-time price per package.</p>
    <div style="margin-top:12mm;display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;max-width:170mm">
      <div style="border-top:2px solid #00c551;padding-top:4mm"><div style="font:500 7pt/1 var(--mono);letter-spacing:.14em;color:#8d958d;text-transform:uppercase">Plan 01</div><div style="font:800 13pt/1.1 var(--display);font-stretch:86%;margin:2.6mm 0 2mm">Website Foundation</div><div style="font-size:9pt;line-height:1.5;color:#b9c0b9">A professional, conversion-focused website. For section A.</div></div>
      <div style="border-top:2px solid #00c551;padding-top:4mm"><div style="font:500 7pt/1 var(--mono);letter-spacing:.14em;color:#8d958d;text-transform:uppercase">Plan 02</div><div style="font:800 13pt/1.1 var(--display);font-stretch:86%;margin:2.6mm 0 2mm">Customer Acquisition</div><div style="font-size:9pt;line-height:1.5;color:#b9c0b9">Landing page and campaigns, built together. For section C.</div></div>
      <div style="border-top:2px solid #00c551;padding-top:4mm"><div style="font:500 7pt/1 var(--mono);letter-spacing:.14em;color:#8d958d;text-transform:uppercase">Plan 03</div><div style="font:800 13pt/1.1 var(--display);font-stretch:86%;margin:2.6mm 0 2mm">Conversion Optimization</div><div style="font-size:9pt;line-height:1.5;color:#b9c0b9">Find and fix where buyers drop out. For sections B and D.</div></div>
    </div>
    <p class="sub" style="margin-top:11mm;max-width:150mm">Or all three, planned as one project, in <strong style="color:#fff">The Complete SYNERGOX Growth Suite</strong>. Current scope and prices are always on the page below.</p>
    <a href="https://synergox.co/growth-system" style="margin-top:9mm;display:inline-block;background:#00c551;color:#0a0c0a;padding:4.6mm 7mm;border-radius:1mm;font:800 12pt/1 var(--display);font-stretch:86%;text-transform:uppercase;letter-spacing:.02em;align-self:flex-start;text-decoration:none">synergox.co/growth-system &nbsp;→</a>
    <div class="foot"><span>Questions about anything in this guide?<br>hello@synergox.co</span><span>© SYNERGOX</span></div>`,
  },
];
