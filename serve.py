"""Local static preview with byte-range support for video seeking."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse,re
ROOT=Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def send_head(self):
  self.remaining=None
  p=Path(self.translate_path(self.path))
  header=self.headers.get('Range')
  if header and p.is_file():
   size=p.stat().st_size;m=re.fullmatch(r'bytes=(\d*)-(\d*)',header)
   if m:
    a,b=m.groups();start=int(a) if a else max(0,size-int(b or 0));end=min(int(b) if a and b else size-1,size-1)
    if start>=size or start>end:
     self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return None
    f=p.open('rb');f.seek(start);self.remaining=end-start+1
    self.send_response(206);self.send_header('Content-Type',self.guess_type(str(p)));self.send_header('Accept-Ranges','bytes');self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Content-Length',str(self.remaining));self.end_headers();return f
  return super().send_head()
 def copyfile(self,source,outputfile):
  try:
   if self.remaining is None:return super().copyfile(source,outputfile)
   while self.remaining:
    buf=source.read(min(self.remaining,65536))
    if not buf:break
    outputfile.write(buf);self.remaining-=len(buf)
  except (BrokenPipeError,ConnectionResetError):pass
 def log_message(self,*args):pass
p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=8765);a=p.parse_args()
server=ThreadingHTTPServer(('127.0.0.1',a.port),Handler)
print(f'Revo3 Demo preview: http://127.0.0.1:{server.server_port}/',flush=True)
server.serve_forever()
