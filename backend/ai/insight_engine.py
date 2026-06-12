from engine.insights.trait_analysis import analyze_traits
from engine.insights.reflection_analysis import analyze_reflections
from engine.insights.timeline_analysis import update_snapshot
from engine.insights.insight_summary import generate_summary


def generate_insights(user_id):

    traits = analyze_traits(user_id)

    reflections = analyze_reflections(user_id)

    timeline = update_snapshot(user_id)

    summary = generate_summary(
        traits["strong_traits"],
        traits["weak_traits"],
        reflections["reflection_score"]
    )

    return {
        **traits,
        **reflections,
        "timeline": timeline,
        "growth_summary": summary,

        # Chart helper arrays
        "trait_labels": [t["trait"] for t in traits["all_traits"]],
        "trait_scores": [t["score"] for t in traits["all_traits"]]
    }
