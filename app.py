import gradio as gr
import os

def serve_app():
    index_path = os.path.join(os.path.dirname(__file__), "dist", "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    return html_content

iface = gr.Interface(
    fn=serve_app,
    inputs=None,
    outputs="html",
    layout="vertical",
    title="LLM2LEAF"
)

iface.launch(server_name="0.0.0.0", server_port=7860)