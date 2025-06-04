import plotly.graph_objects as go
import pandas as pd

# Data
mechanics = ["Daily Checkins", "Point Systems", "Streak Track", "Achievement", 
             "Progress Viz", "Social Feats", "Mini-Games", "Data Export"]

benefits_data = {
    "User Engage": [7, 8, 9, 8, 6, 9, 10, 4],
    "Habit Form": [9, 7, 10, 8, 5, 6, 7, 3],
    "Data Quality": [8, 6, 7, 5, 9, 4, 5, 10],
    "Retention": [6, 7, 9, 8, 7, 8, 9, 5]
}

# Use brighter colors from the brand palette
colors = ['#1FB8CD', '#FFC185', '#D2BA4C', '#B4413C']

# Create the figure
fig = go.Figure()

# Add bars for each benefit category
for i, (benefit, scores) in enumerate(benefits_data.items()):
    fig.add_trace(go.Bar(
        name=benefit,
        x=mechanics,
        y=scores,
        marker_color=colors[i],
        cliponaxis=False
    ))

# Update layout
fig.update_layout(
    title="Game Mechanic Benefits Analysis",
    barmode='group',
    bargap=0.2,      # Increased gap between bars of adjacent location coordinates
    bargroupgap=0.15, # Increased gap between bars of the same location coordinates
    legend=dict(
        orientation='h', 
        yanchor='bottom', 
        y=1.05, 
        xanchor='center', 
        x=0.5
    )
)

# Update axes with better label positioning
fig.update_xaxes(
    title="Game Mechanics",
    tickangle=90,     # Full 90 degree rotation for better readability
    tickfont=dict(size=10)
)

fig.update_yaxes(
    title="Benefit Score",
    range=[0, 10]
)

# Save the chart
fig.write_image("mood_tracker_benefits.png")