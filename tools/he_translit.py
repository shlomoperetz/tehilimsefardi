#!/usr/bin/env python3
"""
Sephardic English transliterator for biblical Hebrew (fully vocalized text).
Works directly from the Hebrew with niqqud (vowel points) + cantillation marks.

Rules (Sephardic English):
  - ח/כ/ך = ch
  - שׁ = sh, שׂ = s
  - צ/ץ = ts
  - ע/א = silent (vowel only)
  - ה at end of word without mappiq = silent
  - ו holam/shuruk = o/u (mater)
  - י after tsere/hiriq without own vowel = silent (mater)
  - יהוה = Adonai
  - Shva at word start or after long vowel = e; otherwise silent
"""

# === Unicode constants ===
DAGESH   = '\u05BC'
RAFE     = '\u05BF'
SHIN_DOT = '\u05C1'
SIN_DOT  = '\u05C2'
MAQAF    = '\u05BE'
SOF_PASUQ = '\u05C3'
SHVA     = '\u05B0'

# Cantillation mark range (strip these)
CANT_LOW, CANT_HIGH = 0x0591, 0x05AF

# Hebrew letter range
HEB_LOW, HEB_HIGH = 0x05D0, 0x05EA

# Vowel point chars (keep these)
VOWELS = {
    '\u05B0': '',    # shva (context-dependent, handled separately)
    '\u05B1': 'e',   # hataf segol
    '\u05B2': 'a',   # hataf patach
    '\u05B3': 'o',   # hataf kamatz
    '\u05B4': 'i',   # hiriq
    '\u05B5': 'e',   # tsere
    '\u05B6': 'e',   # segol
    '\u05B7': 'a',   # patach
    '\u05B8': 'a',   # kamatz gadol
    '\u05B9': 'o',   # holam
    '\u05BA': 'o',   # holam vav
    '\u05BB': 'u',   # kubutz
    '\u05C7': 'o',   # kamatz below (rare)
}
LONG_VOWELS = {'\u05B5', '\u05B8', '\u05B9', '\u05BA'}  # tsere, kamatz, holam, holam-vav

# Hebrew letters → Sephardic English
# Tuple = (with_dagesh, without_dagesh) for bgdkpt; str = always same
LETTERS = {
    '\u05D0': '',           # alef (silent)
    '\u05D1': ('b', 'v'),   # bet / vet
    '\u05D2': 'g',          # gimel
    '\u05D3': 'd',          # dalet
    '\u05D4': 'h',          # he (may be silent — handled in code)
    '\u05D5': 'v',          # vav (consonant; holam/shuruk handled separately)
    '\u05D6': 'z',          # zayin
    '\u05D7': 'ch',         # chet
    '\u05D8': 't',          # tet
    '\u05D9': 'y',          # yod (may be mater — handled in code)
    '\u05DA': 'ch',         # final kaf (always soft in Sephardic)
    '\u05DB': ('k', 'ch'),  # kaf / chaf
    '\u05DC': 'l',          # lamed
    '\u05DD': 'm',          # final mem
    '\u05DE': 'm',          # mem
    '\u05DF': 'n',          # final nun
    '\u05E0': 'n',          # nun
    '\u05E1': 's',          # samech
    '\u05E2': '',           # ayin (silent in Sephardic)
    '\u05E3': 'f',          # final pe (always soft)
    '\u05E4': ('p', 'f'),   # pe / fe
    '\u05E5': 'ts',         # final tsadi
    '\u05E6': 'ts',         # tsadi
    '\u05E7': 'k',          # kuf
    '\u05E8': 'r',          # resh
    '\u05E9': None,         # shin/sin — determined by dot
    '\u05EA': 't',          # tav
}

# Tetragrammaton letter sequence
YHWH = ('\u05D9', '\u05D4', '\u05D5', '\u05D4')  # י ה ו ה


def is_heb(c):
    return HEB_LOW <= ord(c) <= HEB_HIGH


def strip_cantillation(text):
    """Remove cantillation marks, keep vowel points, letters, spaces."""
    out = []
    for c in text:
        cp = ord(c)
        if CANT_LOW <= cp <= CANT_HIGH:   # cantillation → drop
            continue
        if cp == 0x05BD:                  # meteg → drop
            continue
        if cp == 0x05BE:                  # maqaf → space
            out.append(' ')
            continue
        if cp in (0x05C0, 0x05C3, 0x05C6, 0x05C4, 0x05C5):  # paseq, sof pasuq, etc → drop
            continue
        out.append(c)
    return ''.join(out)


def collect_diacritics(chars, start):
    """
    From position start, collect diacritics (vowel points, dagesh, rafe, shin/sin dot).
    Returns (dagesh, rafe, shin_dot, sin_dot, vowel_char, next_pos).
    """
    dag = raf = shin = sin = False
    vowel = None
    j = start
    while j < len(chars):
        c = chars[j]
        cp = ord(c)
        if cp == 0x05BC:
            dag = True
        elif cp == 0x05BF:
            raf = True
        elif cp == 0x05C1:
            shin = True
        elif cp == 0x05C2:
            sin = True
        elif c in VOWELS:
            vowel = c
        elif HEB_LOW <= cp <= HEB_HIGH or c in (' ', ',', '.', ';', ':', '!', '?', '\n', '׃', '׀'):
            break
        else:
            pass  # unknown diacritic, skip
        j += 1
    return dag, raf, shin, sin, vowel, j


def is_tetragrammaton(chars, pos):
    """Check if position pos starts יהוה (ignoring diacritics between letters)."""
    letters = []
    j = pos
    while j < len(chars) and len(letters) < 4:
        c = chars[j]
        if is_heb(c):
            letters.append(c)
        j += 1
    return tuple(letters[:4]) == YHWH


def transliterate_word_aware(text):
    """
    Transliterate stripped Hebrew text (no cantillation) to Sephardic English.
    Handles word boundaries for he-silent, yod-mater, vav-mater, shva-na.
    """
    chars = list(text)
    n = len(chars)
    result = []

    i = 0
    # Track: last vowel emitted (for shva na detection), word-start flag
    at_word_start = True
    prev_vowel = None   # last vowel char processed (for mater detection)

    while i < n:
        c = chars[i]

        # ── Non-Hebrew: pass through ──────────────────────────────────────
        if not is_heb(c):
            if c == ' ':
                at_word_start = True
                prev_vowel = None
                result.append(' ')
            elif c == '׃':   # sof pasuq — skip
                pass
            elif c == '׀':   # paseq — skip
                pass
            else:
                result.append(c)
            i += 1
            continue

        # ── Tetragrammaton check ──────────────────────────────────────────
        if is_tetragrammaton(chars, i):
            # Skip the 4 letters + their diacritics
            letters_found = 0
            j = i
            while j < n and letters_found < 4:
                if is_heb(chars[j]):
                    letters_found += 1
                j += 1
            # Skip diacritics after last letter
            while j < n and not is_heb(chars[j]) and chars[j] != ' ':
                j += 1
            result.append('Adonai')
            at_word_start = False
            prev_vowel = '\u05B4'  # treat as hiriq for mater purposes
            i = j
            continue

        # ── Collect diacritics for this letter ───────────────────────────
        dag, raf, shin_dot, sin_dot, vowel, next_i = collect_diacritics(chars, i + 1)

        # ── VAV: holam-vav or shuruk → pure vowel ─────────────────────────
        if c == '\u05D5':
            if dag and vowel is None:
                # Shuruk (dagesh in vav, no separate vowel) = u
                result.append('u')
                prev_vowel = '\u05BB'
                at_word_start = False
                i = next_i
                continue
            if vowel in ('\u05B9', '\u05BA'):
                # Holam vav = o (vav is mater, not consonant)
                result.append('o')
                prev_vowel = vowel
                at_word_start = False
                i = next_i
                continue
            if vowel is None and not dag and prev_vowel in ('\u05B9', '\u05BA'):
                # Vav after holam on previous letter (לֹו) → mater, silent
                i = next_i
                continue
            # Vav as consonant
            cons = 'v'

        # ── YOD: mater lectionis detection ───────────────────────────────
        elif c == '\u05D9':
            if vowel is None and not at_word_start:
                at_word_end = not (next_i < n and is_heb(chars[next_i]))
                if prev_vowel == '\u05B4':
                    # After hiriq → silent mater (hiriq maleh; "i" already emitted)
                    i = next_i
                    continue
                elif at_word_end:
                    if prev_vowel == '\u05B5':
                        # Tsere + word-final yod → silent (Sephardic: ashre, not ashrei)
                        i = next_i
                        continue
                    else:
                        # Other vowel + word-final yod → diphthong "i" (shadai, etc.)
                        result.append('i')
                        at_word_start = False
                        i = next_i
                        continue
                else:
                    # Yod before another consonant
                    if prev_vowel == '\u05B5':
                        # Tsere + yod before consonant → diphthong "i" (beit, etc.)
                        result.append('i')
                        at_word_start = False
                        i = next_i
                        continue
                    else:
                        # Other vowel + yod before consonant → consonant "y" (elyon, etc.)
                        cons = 'y'
            else:
                cons = 'y'

        # ── HE: final silent he ───────────────────────────────────────────
        elif c == '\u05D4':
            if vowel is None and not dag:
                # He with no vowel and no mappiq: check if end of word
                after = next_i
                while after < n and not is_heb(chars[after]) and chars[after] != ' ':
                    after += 1
                if after >= n or chars[after] == ' ':
                    # End of word → silent
                    i = next_i
                    continue
            cons = 'h'

        # ── SHIN / SIN ────────────────────────────────────────────────────
        elif c == '\u05E9':
            if shin_dot:
                cons = 'sh'
            elif sin_dot:
                cons = 's'
            else:
                cons = 'sh'  # default (some texts omit the dot)

        # ── BGDKPT letters ────────────────────────────────────────────────
        elif c in LETTERS and isinstance(LETTERS[c], tuple):
            hard, soft = LETTERS[c]
            if c in ('\u05D1', '\u05DB', '\u05E4'):
                # bet, kaf, pe: dagesh → hard
                cons = hard if dag else soft
            else:
                cons = hard  # gimel, dalet, tav same either way in Sephardic

        # ── Simple letters ────────────────────────────────────────────────
        else:
            cons = LETTERS.get(c, '')

        # ── Vowel ─────────────────────────────────────────────────────────
        if vowel == SHVA:
            # Shva na (vocal) = e: at word start, or after long vowel, or after another shva
            if at_word_start or prev_vowel in LONG_VOWELS or prev_vowel == SHVA:
                vowel_str = 'e'
            else:
                vowel_str = ''  # shva nach (silent)
        elif vowel is not None:
            vowel_str = VOWELS.get(vowel, '')
        else:
            vowel_str = ''

        result.append(cons + vowel_str)
        prev_vowel = vowel
        at_word_start = False
        i = next_i

    return ''.join(result).strip()


def transliterate(hebrew_text):
    """Full pipeline: strip cantillation, transliterate, clean up."""
    stripped = strip_cantillation(hebrew_text)
    raw = transliterate_word_aware(stripped)
    # Clean up: collapse multiple spaces, fix maqaf artifacts
    import re
    raw = re.sub(r'  +', ' ', raw)
    raw = raw.strip()
    # Capitalize first letter
    if raw:
        raw = raw[0].upper() + raw[1:]
    return raw


if __name__ == '__main__':
    # Quick test with Psalm 1:1
    test = 'אַשְׁרֵי הָאִישׁ אֲשֶׁר לֹא הָלַךְ בַּעֲצַת רְשָׁעִים וּבְדֶרֶךְ חַטָּאִים לֹא עָמָד וּבְמוֹשַׁב לֵצִים לֹא יָשָׁב'
    print('Input:', test)
    print('Output:', transliterate(test))
