import { describe, expect, it } from 'vitest';
import { extrahiereVideoId } from '../src/lib/youtube';

const ID = 'dQw4w9WgXcQ';

describe('YouTube-Video-ID aus verschiedenen Adressformen erkennen', () => {
  it('erkennt die klassische watch-Adresse', () => {
    expect(extrahiereVideoId(`https://www.youtube.com/watch?v=${ID}`)).toBe(ID);
    expect(extrahiereVideoId(`https://youtube.com/watch?v=${ID}`)).toBe(ID);
    expect(extrahiereVideoId(`http://m.youtube.com/watch?v=${ID}`)).toBe(ID);
  });

  it('erkennt die kurze youtu.be-Adresse', () => {
    expect(extrahiereVideoId(`https://youtu.be/${ID}`)).toBe(ID);
    expect(extrahiereVideoId(`https://youtu.be/${ID}?t=42`)).toBe(ID);
  });

  it('erkennt Shorts und eingebettete Videos', () => {
    expect(extrahiereVideoId(`https://www.youtube.com/shorts/${ID}`)).toBe(ID);
    expect(extrahiereVideoId(`https://www.youtube.com/embed/${ID}`)).toBe(ID);
  });

  it('ignoriert zusätzliche Parameter wie Zeitstempel oder Playlist', () => {
    expect(extrahiereVideoId(`https://www.youtube.com/watch?v=${ID}&list=PL123&t=90s`)).toBe(ID);
    expect(extrahiereVideoId(`https://www.youtube.com/watch?list=PL123&v=${ID}`)).toBe(ID);
  });

  it('funktioniert ohne https:// davor (copy-paste ohne Protokoll)', () => {
    expect(extrahiereVideoId(`youtu.be/${ID}`)).toBe(ID);
    expect(extrahiereVideoId(`www.youtube.com/watch?v=${ID}`)).toBe(ID);
  });

  it('akzeptiert auch nur die nackte Video-ID', () => {
    expect(extrahiereVideoId(ID)).toBe(ID);
  });

  it('übersteht führende/nachfolgende Leerzeichen (copy-paste aus dem Handy)', () => {
    expect(extrahiereVideoId(`  https://youtu.be/${ID}  `)).toBe(ID);
  });

  it('lehnt fremde Adressen und Unsinn ab', () => {
    expect(extrahiereVideoId('https://vimeo.com/12345678')).toBeNull();
    expect(extrahiereVideoId('kein-link')).toBeNull();
    expect(extrahiereVideoId('')).toBeNull();
    expect(extrahiereVideoId('https://www.youtube.com/')).toBeNull();
    expect(extrahiereVideoId('https://www.youtube.com/channel/UC123456789012345678901')).toBeNull();
  });
});
