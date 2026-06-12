def generate_summary(strong_traits, weak_traits, reflection_score):

    strongest = strong_traits[-1]["trait"]
    weakest = weak_traits[0]["trait"]

    return (
        f"You show strong development in {strongest}. "
        f"Reflection quality is currently {reflection_score}. "
        f"Focusing on {weakest} could significantly improve your growth."
    )