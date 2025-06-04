import plotly.graph_objects as go
import numpy as np

# Data for the mood tracker components
components = [
    {
        "name": "User Input",
        "description": "Mood select via emojis",
        "icon": "😊"
    },
    {
        "name": "Game Mechanics", 
        "description": "Points & streaks",
        "icon": "🎮"
    },
    {
        "name": "Data Storage",
        "description": "localStorage",
        "icon": "💾"
    },
    {
        "name": "Feedback Systems",
        "description": "Achievements",
        "icon": "🏆"
    },
    {
        "name": "Visualization",
        "description": "Charts",
        "icon": "📊"
    },
    {
        "name": "Analytics",
        "description": "Insights",
        "icon": "🧠"
    }
]

connections = [
    {"from": 0, "to": 1},
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 2, "to": 4},
    {"from": 4, "to": 5},
    {"from": 5, "to": 0}
]

# Use brand colors
brand_colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C', '#B4413C']

# Create positions for horizontal flow
x_positions = list(range(len(components)))
y_position = 0

# Create the figure
fig = go.Figure()

# Add component nodes
for i, comp in enumerate(components):
    fig.add_trace(go.Scatter(
        x=[x_positions[i]],
        y=[y_position],
        mode='markers+text',
        marker=dict(
            size=60,
            color=brand_colors[i % len(brand_colors)],
            line=dict(width=2, color='white')
        ),
        text=comp['icon'],
        textposition='middle center',
        textfont=dict(size=24),
        name=comp['name'],
        hovertemplate=f"<b>{comp['name']}</b><br>{comp['description']}<extra></extra>",
        cliponaxis=False,
        showlegend=True
    ))
    
    # Add description below the icon
    fig.add_trace(go.Scatter(
        x=[x_positions[i]],
        y=[y_position-0.2],
        mode='text',
        text=comp['name'],
        textposition='middle center',
        textfont=dict(size=12),
        hoverinfo='skip',
        cliponaxis=False,
        showlegend=False
    ))

# Add connection arrows
for conn in connections:
    from_idx = conn["from"]
    to_idx = conn["to"]
    
    # Create arrow line
    fig.add_trace(go.Scatter(
        x=[x_positions[from_idx], x_positions[to_idx]],
        y=[y_position, y_position],
        mode='lines',
        line=dict(color='gray', width=2),
        hoverinfo='skip',
        cliponaxis=False,
        showlegend=False
    ))
    
    # Add arrowhead
    if to_idx > from_idx:
        # Right-pointing arrow
        fig.add_trace(go.Scatter(
            x=[x_positions[to_idx]-0.15, x_positions[to_idx]-0.3, x_positions[to_idx]-0.15],
            y=[y_position+0.1, y_position, y_position-0.1],
            mode='lines',
            line=dict(color='gray', width=2),
            fill='toself',
            hoverinfo='skip',
            cliponaxis=False,
            showlegend=False
        ))
    else:
        # Left-pointing arrow (for the feedback loop)
        x_mid = (x_positions[from_idx] + x_positions[to_idx]) / 2
        fig.add_trace(go.Scatter(
            x=[x_positions[to_idx]+0.15, x_positions[to_idx]+0.3, x_positions[to_idx]+0.15],
            y=[y_position+0.1, y_position, y_position-0.1],
            mode='lines',
            line=dict(color='gray', width=2),
            fill='toself',
            hoverinfo='skip',
            cliponaxis=False,
            showlegend=False
        ))
        
        # Make the feedback loop curved
        curve_x = np.linspace(x_positions[from_idx], x_positions[to_idx], 50)
        curve_y = [y_position + 0.5 * np.sin(np.pi * (x - x_positions[to_idx]) / 
                  (x_positions[from_idx] - x_positions[to_idx])) for x in curve_x]
        
        fig.add_trace(go.Scatter(
            x=curve_x,
            y=curve_y,
            mode='lines',
            line=dict(color='gray', width=2, dash='dot'),
            hoverinfo='skip',
            cliponaxis=False,
            showlegend=False
        ))

# Update layout
fig.update_layout(
    title="Mood Tracker Game Flow",
    xaxis=dict(
        showgrid=False,
        zeroline=False,
        showticklabels=False,
        title=""
    ),
    yaxis=dict(
        showgrid=False,
        zeroline=False, 
        showticklabels=False,
        title=""
    ),
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.05,
        xanchor='center',
        x=0.5
    ),
    plot_bgcolor='white'
)

# Update axes ranges to give some padding
fig.update_xaxes(range=[-0.5, len(components)-0.5])
fig.update_yaxes(range=[-0.7, 1.2])

# Save the chart
fig.write_image("mood_tracker_flow.png")