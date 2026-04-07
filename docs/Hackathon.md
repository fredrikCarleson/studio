Hackathon. Two days. Three teams. Fifteen brains.
It
started early in the morning on November 24th, just as the sun crept over the rooftops of Stockholm. We walked through the glass doors of Google's office — a place with lots of colours, candy and the smell of coffee and technology, and perhaps nerdiness. But more importantly, a big room for the Hackathon. Personally, I was genuinely excited to see how much we would get out of this and just how hard—or easy—it really is to build a multi-agent AI solution: multiple specialised agents working together to reach a goal.


Our goal was as simple as it was bold:
Could we, in just two days — without prior preparation — build solutions where multiple AI agents collaborate to solve real problems at the Swedish Tax Agency?
We weren't building for perfection. We were building to understand the behaviour, limits, and possibilities of agentic AI.
Our main takeaways?
More agents are more powerful — when agents are given roles, responsibilities, and peers, one plus one can become three.
Structure is more complex than technology — one agent is easy. Five agents are… organised digital chaos if you're not careful.
AI is brilliant at finding patterns — but less trustworthy if you need to provide public answers.
This article is the story of what we built, what we learned — and why we are already planning the next round.
The Story Begins
T
here we were. Three teams gathered around their tables — five people per team. A bit of nervous excitement, a bit of prestige, and a wish to get started
To keep the bar high, we defined four clear winning criteria for the Hackathon:
Feasibility — does it actually work?
Innovation — is it new?
Presentation — can someone understand what you built?
Clever use of AI — real agents, not just API calls in disguise
With that, we kicked off two intense days filled with laughter, frustration, experimentation, crash-and-debug cycles — and some aha moments.
Let's go through what each team tried to accomplish.
Team Alpha — Influencer Risk with an Agent Swarm
In
Sweden, more than ten thousand influencers make a living from collaborations, gifts, and brand deals. Many want to do the right thing — but tax rules are not always easy to interpret.
This means there is a risk that influencers— knowingly or not — slip into the hidden economy, accepting expensive gifts.
The problem is how to verify at scale. No human can keep up. There are too many feeds. Too many platforms. Too much speed.
So Team Alpha asked:
"Can we automatically detect risks in the influencer economy before it can become a problem for the influencer?"
Let's face it, no one wants a surprise e-mail at the end of the year, having to pay extra tax. So with this in mind, the team started to create their agent swarm.
These agents were used:
One agent scrapes the web and collects social media data.
A valuation agent estimates the value of products and gifts.
Additional agents spin up automatically: one looks for company connections, another analyses trends, and a third performs risk assessments.
Finally, everything is consolidated into a single profile with an evaluation and recommended next steps.
What could take a human days now takes minutes.
And when the team suggested how the same approach could be used multimodally—for example, identifying luxury watches in YouTube videos and comparing them with declared income —that was interesting. However, it dawned on us that this could be adapted for other uses, such as crime prevention and scanning for stolen goods; that was when the jury leaned forward for real.
Team Bravo — Skatti 2.0
E
very day, the Tax Information Service receives thousands of questions from individuals and businesses simply trying to understand what applies to them. The regulations are extensive, the variation enormous, and the questions range from trivial to deeply complex.
What if we could use agents to give correct answers? What if many of those questions could be handled automatically — if we had a digital colleague that helped?
That was Team Bravo's starting point:
"Can we create Skatti 2.0 — an agent that supports the Tax Information Service 24/7 without getting tired?"
The solution began with a large experiment. The team tried to let the agent retrieve answers directly from the Swedish Tax Agency's external website, expecting it to read, interpret, and reproduce correct information.
But fairly quickly, an unexpected problem emerged.
The quality of the answers became… shaky.
After many iterations, the team realised something important:
The "trained" agent often performed worse than a plain language model.
The explanation turned out to be simple:
The official sites explain what to do but not how.
There are lots of sites on the web that explain how. Better than the official site. However, there are also sites giving wrong information.
Answering how to do something is very different from what you need to do. These are two very different types of knowledge. And you need an expert to judge what is actually correct — not even 90% accuracy is good enough in this case.
The lesson was clear:
For precise legal answers, we did not get enough accuracy.
But for reasoning, guidance, hypotheses, and pedagogy, we can get excellent help.
Skatti 2.0 turned out to be a promising colleague. Just one you occasionally have to correct: "Skatti… you're actually making that up.
Team Delta — Risk Assessment with a Holistic View
E
very year, the Swedish Tax Agency evaluates thousands of companies to determine which may require deeper inspection. It's critical work — and often manual — involving downloading data from annual reports, public registries, official statistics, and other sources.
That is important work. But also work where humans easily drown in data.
Team Delta, therefore, started with a fundamental question:
"Can we automate the first risk assessment — without compromising quality?"
Their solution was built step by step.
One agent collects annual reports and structured data.
Another agent fetches data from Statistics Sweden as additional context.
Other public information is automatically gathered to complete the picture.
Finally, an analysis agent produces a preliminary risk evaluation:
Which companies stand out? Where are the anomalies? Which ones deserve closer scrutiny?
What could take humans hours to compile was done in minutes — and perhaps more consistently.
Technically, the solution combined serial and parallel agent execution, orchestrated through callbacks that kept everything aligned, like a small digital team where each agent knew precisely when to step in.
The result came close to something ready for production that can be used directly.
It didn't feel like an experiment.
It felt like the first draft of future risk analysis.
This wasn't science fiction.
It was a prototype that could already make a difference.
So who was the winner?
The Winner — Team Alpha
W
ith their combination of social media data, valuation logic, and dynamic agent orchestration, Team Alpha took home the win.
The jury summarised it as:
“The contribution shows how the power of multi-agent systems can be used in a powerful yet playful way to clearly demonstrate the potential for the Swedish Tax Agency.”
Lessons Learned — and Why This Is Just the Beginning
M
ulti-agent systems are not that hard to set up— but they require structure.
Agents are like developers with total world knowledge and zero judgment. They can do amazing things, but need clear boundaries.
Just like humans, agents complement each other, for example:
One gathers facts. Another verifies them. A third checks quality.
The result is often far better than asking a single model to do everything. Same as when you put together a team to complete a task that is impossible for one person to do on her own.
The most important lesson was perhaps that:
Agents struggle when the data must be perfectly correct. But they excel at discovering trends, exploring large datasets, and testing hypotheses.
This Is Only the Beginning
W
hen the last commits were pushed and the coffee cups cleared, one thing was obvious:
This was a glimpse of the future.
We saw agents save time, uncover patterns, and work in parallel in ways humans never could. We also saw how quickly everything falls apart without structure and orchestration.
After these two days, we became curious.
Curious about what else can be automated.
Curious about what agents should take off our plates.
Curious about how to best design collaboration between humans and machines.
With the possibility for multi-agent solutions, a new playing field opens — one where agents don't just respond, but act, integrate, and orchestrate workflows on their own.
That opens enormous possibilities. It also raises the questions we can't avoid once agents start acting instead of just answering:
Who is accountable when an agent makes a bad call — the developer, the business, or "the system"?
Where do we draw the line between automation and decision-making?
How do we build systems that are not just clever, but safe and accountable?
And what does "good enough" mean when the output affects real people?
Because agents are not just technology. They're teammates without judgment. They need boundaries, orchestration, and patience.
And apparently, so do we.
And that's exactly where the journey continues.
“The future is already here — it’s just not evenly distributed.”
— William Gibson
Disclaimer:
The views and reflections expressed in this article are my own and based on an internal hackathon and exploratory work. They do not represent official positions, policies, or decisions of the Swedish Tax Agency, nor do they imply that any described solutions will be implemented in operational systems.

