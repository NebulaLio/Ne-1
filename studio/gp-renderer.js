/* ============================================================================
   Nebula · Guitar Pro Multi-Track Synchronized SVG Renderer (Classic IIFE)
   ============================================================================ */
(function (global) {
  "use strict";

  const NS = (global.NebulaGP = global.NebulaGP || {});
  const SVG_NS = "http://www.w3.org/2000/svg";

  function svgEl(tag, attrs, text) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        const v = attrs[k];
        if (v !== undefined && v !== null) node.setAttribute(k, String(v));
      });
    }
    if (text !== undefined && text !== "") node.textContent = String(text);
    return node;
  }

  function getThemeColors() {
    const cs = getComputedStyle(document.body);
    const get = function (v, fb) {
      const val = cs.getPropertyValue(v);
      return (val && val.trim()) ? val.trim() : fb;
    };
    return {
      bg: get("--bg", "#0a0f22"),
      surface: get("--surface-strong", "#1e293b"),
      ink: get("--ink", "#e2e8f0"),
      muted: get("--muted", "#94a3b8"),
      line: get("--staff-line", "rgba(148,163,184,0.38)"),
      accent: get("--accent", "#6366f1"),
      accentSoft: get("--accent-soft", "rgba(99,102,241,0.22)"),
      warm: get("--warm", "#f59e0b"),
      rose: get("--rose", "#fb7185"),
      blue: get("--blue", "#60a5fa")
    };
  }

  class GPScoreRenderer {
    constructor(svgElement, callbacks) {
      this.svg = svgElement;
      this.callbacks = callbacks || {};
      this.layout = {
        leftMargin: 132,
        measureWidth: 248,
        staffGap: 10,
        tabGap: 14,
        staffToTabGap: 36,
        trackGap: 48
      };
      this.dragState = null;
      this._bindGlobalDrag();
    }

    _bindGlobalDrag() {
      const self = this;
      global.addEventListener("pointermove", function (e) {
        if (!self.dragState) return;
        const dy = self.dragState.startY - e.clientY;
        const deltaSteps = Math.round(dy / 7);
        if (deltaSteps !== self.dragState.lastDelta) {
          self.dragState.lastDelta = deltaSteps;
          if (self.callbacks.onNoteDrag) {
            self.callbacks.onNoteDrag({
              trackIndex: self.dragState.trackIndex,
              measureIndex: self.dragState.measureIndex,
              beatIndex: self.dragState.beatIndex,
              noteIndex: self.dragState.noteIndex,
              startY: self.dragState.startY,
              startMidi: self.dragState.startMidi,
              deltaSteps: deltaSteps
            });
          }
        }
      });
      global.addEventListener("pointerup", function () {
        self.dragState = null;
      });
    }

    _clientToSvgPoint(clientX, clientY) {
      const pt = this.svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = this.svg.getScreenCTM();
      return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
    }

    render(score, cursor, playhead, loopRange) {
      const M = NS.Model;
      const self = this;
      const colors = getThemeColors();
      const leftMargin = this.layout.leftMargin;
      const measureWidth = this.layout.measureWidth;
      const staffGap = this.layout.staffGap;
      const tabGap = this.layout.tabGap;
      const staffToTabGap = this.layout.staffToTabGap;
      const trackGap = this.layout.trackGap;

      const measureCount = Math.max(1, (score.tracks[0] && score.tracks[0].measures.length) || 0);
      const totalWidth = leftMargin + measureCount * measureWidth + 44;
      const ts = score.meta.timeSignature || [4, 4];
      const tsNum = ts[0], tsDen = ts[1];
      const fifths = M.KEY_SIGNATURES[score.meta.keySignature || "C"] || 0;
      const preferFlats = fifths < 0;
      const keyLabel = fifths > 0 ? (fifths + "♯") : fifths < 0 ? (Math.abs(fifths) + "♭") : "";

      this.svg.innerHTML = "";
      let currentY = 44;

      // 1. Measure Number Header & AB Loop Band
      for (let m = 0; m < measureCount; m++) {
        (function (mIndex) {
          const mx = leftMargin + mIndex * measureWidth;
          const inLoop = Boolean(loopRange && loopRange.enabled && mIndex >= loopRange.a && mIndex <= loopRange.b);

          if (inLoop) {
            self.svg.appendChild(svgEl("rect", {
              x: mx, y: 8, width: measureWidth, height: 22, rx: 4,
              fill: colors.accentSoft, stroke: colors.accent, "stroke-width": 1
            }));
          }

          const mTag = svgEl("g", { style: "cursor:pointer" });
          const abText = (loopRange && loopRange.enabled && mIndex === loopRange.a ? " [A]" : "") +
                         (loopRange && loopRange.enabled && mIndex === loopRange.b ? " [B]" : "");
          mTag.appendChild(svgEl("text", {
            x: mx + 8, y: 23,
            fill: inLoop ? colors.accent : colors.muted,
            "font-size": 11, "font-weight": "800", "font-family": "var(--mono, monospace)"
          }, "M" + (mIndex + 1) + abText));

          const refM = score.tracks[0] && score.tracks[0].measures[mIndex];
          if (refM && refM.repeatStart) {
            mTag.appendChild(svgEl("text", {
              x: mx + 64, y: 23, fill: colors.warm, "font-size": 11, "font-weight": "800"
            }, "𝄆"));
          }
          if (refM && refM.repeatEnd) {
            mTag.appendChild(svgEl("text", {
              x: mx + measureWidth - 18, y: 23, fill: colors.warm, "font-size": 11, "font-weight": "800"
            }, "𝄇"));
          }
          mTag.addEventListener("click", function () {
            if (self.callbacks.onMeasureClick) self.callbacks.onMeasureClick(mIndex);
          });
          self.svg.appendChild(mTag);
        })(m);
      }

      // 2. Render each track
      score.tracks.forEach(function (track, tIdx) {
        const isFretted = Array.isArray(track.tuning) && track.tuning.length > 0;
        const showStaff = track.showStaff !== false;
        const showTab = Boolean(track.showTab && isFretted);
        if (!showStaff && !showTab) return;

        const trackStartY = currentY;
        const staffHeight = showStaff ? staffGap * 4 : 0;
        const stringCount = isFretted ? track.tuning.length : 0;
        const tabHeight = showTab ? tabGap * Math.max(1, stringCount - 1) : 0;
        const staffTopY = currentY;
        const tabTopY = showStaff ? currentY + staffHeight + staffToTabGap : currentY;
        const trackBottomY = showTab ? tabTopY + tabHeight : staffTopY + staffHeight;
        const isCurrentTrack = Boolean(cursor && cursor.trackIndex === tIdx);

        self.svg.appendChild(svgEl("rect", {
          x: 4, y: trackStartY - 4, width: 4, height: trackBottomY - trackStartY + 8, rx: 2,
          fill: isCurrentTrack ? (track.color || colors.accent) : colors.line
        }));

        self.svg.appendChild(svgEl("text", {
          x: 14, y: trackStartY + 14,
          fill: isCurrentTrack ? colors.ink : colors.muted,
          "font-size": 12, "font-weight": "800"
        }, String(track.name || "Track").slice(0, 12)));

        const subParts = [];
        if (track.muted) subParts.push("MUTE");
        else if (track.solo) subParts.push("SOLO");
        if (track.capo) subParts.push("Capo " + track.capo);
        if (subParts.length) {
          self.svg.appendChild(svgEl("text", {
            x: 14, y: trackStartY + 29,
            fill: track.muted ? colors.rose : colors.warm,
            "font-size": 10, "font-family": "var(--mono, monospace)", "font-weight": "700"
          }, subParts.join(" · ")));
        }

        self.svg.appendChild(svgEl("line", {
          x1: leftMargin, y1: trackStartY, x2: leftMargin, y2: trackBottomY,
          stroke: track.color || colors.accent, "stroke-width": 2.6
        }));

        if (showStaff) {
          for (let line = 0; line < 5; line++) {
            const ly = staffTopY + line * staffGap;
            self.svg.appendChild(svgEl("line", {
              x1: leftMargin, y1: ly, x2: leftMargin + measureCount * measureWidth, y2: ly,
              stroke: colors.line, "stroke-width": 1.1
            }));
          }
          self.svg.appendChild(svgEl("text", {
            x: leftMargin - 48, y: staffTopY + (track.clef === "bass" ? 31 : 34),
            fill: track.color || colors.accent, "font-size": track.clef === "bass" ? 30 : 38, "font-family": "serif"
          }, track.clef === "bass" ? "𝄢" : "𝄞"));

          if (keyLabel) {
            self.svg.appendChild(svgEl("text", {
              x: leftMargin - 22, y: staffTopY + 14,
              fill: colors.warm, "font-size": 10, "font-weight": "800"
            }, keyLabel));
          }
          self.svg.appendChild(svgEl("text", {
            x: leftMargin - 16, y: staffTopY + 19,
            fill: colors.ink, "font-size": 13, "font-weight": "900", "font-family": "var(--mono, monospace)"
          }, String(tsNum)));
          self.svg.appendChild(svgEl("text", {
            x: leftMargin - 16, y: staffTopY + 35,
            fill: colors.ink, "font-size": 13, "font-weight": "900", "font-family": "var(--mono, monospace)"
          }, String(tsDen)));
        }

        if (showTab) {
          for (let s = 0; s < stringCount; s++) {
            const sy = tabTopY + s * tabGap;
            self.svg.appendChild(svgEl("line", {
              x1: leftMargin, y1: sy, x2: leftMargin + measureCount * measureWidth, y2: sy,
              stroke: colors.line, "stroke-width": 1
            }));
            const sName = M.midiToName(track.tuning[s], preferFlats).replace(/\d+$/, "");
            self.svg.appendChild(svgEl("text", {
              x: leftMargin - 14, y: sy + 4,
              fill: colors.muted, "font-size": 10, "font-weight": "700",
              "text-anchor": "end", "font-family": "var(--mono, monospace)"
            }, s === 0 && stringCount === 6 ? sName.toLowerCase() : sName));
          }
          self.svg.appendChild(svgEl("text", {
            x: leftMargin - 36, y: tabTopY + tabHeight / 2 + 4,
            fill: colors.muted, "font-size": 10, "font-weight": "900",
            "font-family": "var(--mono, monospace)"
          }, "TAB"));
        }

        track.measures.forEach(function (measure, mIdx) {
          const mx = leftMargin + mIdx * measureWidth;

          if (loopRange && loopRange.enabled && mIdx >= loopRange.a && mIdx <= loopRange.b) {
            self.svg.appendChild(svgEl("rect", {
              x: mx, y: trackStartY, width: measureWidth, height: trackBottomY - trackStartY,
              fill: colors.accentSoft, opacity: 0.25, "pointer-events": "none"
            }));
          }

          if (mIdx > 0) {
            self.svg.appendChild(svgEl("line", {
              x1: mx, y1: trackStartY, x2: mx, y2: trackBottomY,
              stroke: colors.muted, "stroke-width": 1.2, opacity: 0.7
            }));
          }
          if (measure.repeatStart) {
            self.svg.appendChild(svgEl("line", { x1: mx + 4, y1: trackStartY, x2: mx + 4, y2: trackBottomY, stroke: colors.warm, "stroke-width": 2.8 }));
            self.svg.appendChild(svgEl("line", { x1: mx + 9, y1: trackStartY, x2: mx + 9, y2: trackBottomY, stroke: colors.warm, "stroke-width": 1 }));
            self.svg.appendChild(svgEl("circle", { cx: mx + 14, cy: trackStartY + 14, r: 2.2, fill: colors.warm }));
            self.svg.appendChild(svgEl("circle", { cx: mx + 14, cy: trackStartY + 26, r: 2.2, fill: colors.warm }));
          }
          if (measure.repeatEnd) {
            const ex = mx + measureWidth;
            self.svg.appendChild(svgEl("line", { x1: ex - 4, y1: trackStartY, x2: ex - 4, y2: trackBottomY, stroke: colors.warm, "stroke-width": 2.8 }));
            self.svg.appendChild(svgEl("line", { x1: ex - 9, y1: trackStartY, x2: ex - 9, y2: trackBottomY, stroke: colors.warm, "stroke-width": 1 }));
            self.svg.appendChild(svgEl("circle", { cx: ex - 14, cy: trackStartY + 14, r: 2.2, fill: colors.warm }));
            self.svg.appendChild(svgEl("circle", { cx: ex - 14, cy: trackStartY + 26, r: 2.2, fill: colors.warm }));
          }
          if (mIdx === measureCount - 1) {
            self.svg.appendChild(svgEl("line", {
              x1: mx + measureWidth, y1: trackStartY, x2: mx + measureWidth, y2: trackBottomY,
              stroke: colors.ink, "stroke-width": 2.4
            }));
          }

          const beatCount = Math.max(1, measure.beats.length);
          const beatWidth = measureWidth / beatCount;
          const beamCoords = [];

          measure.beats.forEach(function (beat, bIdx) {
            const bx = mx + bIdx * beatWidth + beatWidth * 0.48;
            const isPlayhead = Boolean(playhead && playhead.measureIndex === mIdx && playhead.beatIndex === bIdx);
            const isSelectedBeat = Boolean(cursor && cursor.trackIndex === tIdx && cursor.measureIndex === mIdx && cursor.beatIndex === bIdx);

            if (isPlayhead) {
              self.svg.appendChild(svgEl("rect", {
                x: bx - 14, y: trackStartY - 6, width: 28, height: trackBottomY - trackStartY + 12, rx: 4,
                fill: colors.rose, opacity: 0.16, "pointer-events": "none"
              }));
              self.svg.appendChild(svgEl("line", {
                x1: bx, y1: trackStartY - 8, x2: bx, y2: trackBottomY + 8,
                stroke: colors.rose, "stroke-width": 2.2, "pointer-events": "none"
              }));
            }

            if (showStaff) {
              const hit = svgEl("rect", {
                x: mx + bIdx * beatWidth + 2, y: staffTopY - 22,
                width: beatWidth - 4, height: staffHeight + 44,
                fill: isSelectedBeat && !showTab ? colors.accentSoft : "transparent",
                rx: 4, style: "cursor: crosshair"
              });
              hit.addEventListener("click", function (evt) {
                const p = self._clientToSvgPoint(evt.clientX, evt.clientY);
                const bottomLineY = staffTopY + 4 * staffGap;
                const stepFromBottom = Math.round((bottomLineY - p.y) / (staffGap / 2));
                const clickedMidi = M.staffStepToMidi(stepFromBottom, track.clef, track.octaveShift);
                if (self.callbacks.onStaffClick) {
                  self.callbacks.onStaffClick({
                    trackIndex: tIdx, measureIndex: mIdx, beatIndex: bIdx,
                    midi: clickedMidi, stepFromBottom: stepFromBottom
                  });
                }
              });
              self.svg.appendChild(hit);
            }

            if (showTab) {
              for (let sIdx = 0; sIdx < stringCount; sIdx++) {
                (function (stringIdx) {
                  const sy = tabTopY + stringIdx * tabGap;
                  const isCursorSlot = isSelectedBeat && cursor.stringIndex === stringIdx;
                  const slot = svgEl("rect", {
                    class: "gp-svg-slot",
                    x: bx - 13, y: sy - 7, width: 26, height: 14, rx: 3,
                    fill: isCursorSlot ? colors.accentSoft : "transparent",
                    stroke: isCursorSlot ? colors.accent : "none",
                    "stroke-width": isCursorSlot ? 1.4 : 0,
                    style: "cursor: pointer"
                  });
                  slot.addEventListener("click", function () {
                    if (self.callbacks.onSelectSlot) {
                      self.callbacks.onSelectSlot({
                        trackIndex: tIdx, measureIndex: mIdx, beatIndex: bIdx, stringIndex: stringIdx
                      });
                    }
                  });
                  self.svg.appendChild(slot);
                })(sIdx);
              }
            }

            if (beat.tuplet === 3) {
              const ty = showStaff ? staffTopY - 14 : tabTopY - 10;
              self.svg.appendChild(svgEl("text", {
                x: bx, y: ty, "text-anchor": "middle",
                fill: colors.warm, "font-size": 10, "font-weight": "900", "font-family": "var(--mono, monospace)"
              }, "3"));
            }

            if (beat.isRest) {
              const restGlyph = beat.duration === 1 ? "𝄻" : beat.duration === 2 ? "𝄼" : beat.duration === 8 ? "𝄾" : beat.duration === 16 ? "𝄿" : "𝄽";
              if (showStaff) {
                self.svg.appendChild(svgEl("text", {
                  x: bx, y: staffTopY + 26, "text-anchor": "middle",
                  fill: colors.muted, "font-size": 22, "pointer-events": "none"
                }, restGlyph));
              }
              if (showTab && !showStaff) {
                self.svg.appendChild(svgEl("text", {
                  x: bx, y: tabTopY + tabHeight / 2 + 5, "text-anchor": "middle",
                  fill: colors.muted, "font-size": 16, "pointer-events": "none"
                }, restGlyph));
              }
              return;
            }

            let highestNoteY = Infinity;
            let lowestNoteY = -Infinity;

            beat.notes.forEach(function (note, nIdx) {
              const midi = note.midi != null ? note.midi : M.fretToMidi(track, note.string, note.fret);
              if (midi == null) return;
              const tech = note.tech || {};
              const noteColor = isPlayhead ? colors.rose : (track.color || colors.accent);

              if (showStaff) {
                const pos = M.midiToStaffPosition(midi, track.clef, track.octaveShift, preferFlats);
                const ny = staffTopY + 4 * staffGap - pos.step * (staffGap / 2);
                if (ny < highestNoteY) highestNoteY = ny;
                if (ny > lowestNoteY) lowestNoteY = ny;

                const gNote = svgEl("g", { class: "gp-svg-note" });
                if (pos.step <= -2) {
                  for (let s = -2; s >= pos.step; s -= 2) {
                    const ly = staffTopY + 4 * staffGap - s * (staffGap / 2);
                    gNote.appendChild(svgEl("line", { x1: bx - 10, y1: ly, x2: bx + 10, y2: ly, stroke: colors.muted, "stroke-width": 1.2 }));
                  }
                } else if (pos.step >= 10) {
                  for (let s = 10; s <= pos.step; s += 2) {
                    const ly = staffTopY + 4 * staffGap - s * (staffGap / 2);
                    gNote.appendChild(svgEl("line", { x1: bx - 10, y1: ly, x2: bx + 10, y2: ly, stroke: colors.muted, "stroke-width": 1.2 }));
                  }
                }

                if (pos.accidental) {
                  gNote.appendChild(svgEl("text", {
                    x: bx - 15, y: ny + 4, fill: colors.warm, "font-size": 12, "font-weight": "800"
                  }, pos.accidental));
                }

                if (tech.deadNote) {
                  gNote.appendChild(svgEl("text", {
                    x: bx, y: ny + 4, "text-anchor": "middle", fill: colors.rose, "font-size": 13, "font-weight": "900"
                  }, "✕"));
                } else if (tech.harmonic) {
                  gNote.appendChild(svgEl("polygon", {
                    points: bx + "," + (ny - 5) + " " + (bx + 6) + "," + ny + " " + bx + "," + (ny + 5) + " " + (bx - 6) + "," + ny,
                    fill: colors.bg, stroke: colors.blue, "stroke-width": 1.8
                  }));
                } else {
                  const isHollow = beat.duration <= 2;
                  gNote.appendChild(svgEl("ellipse", {
                    cx: bx, cy: ny, rx: 5.8, ry: 4.1,
                    transform: "rotate(-18 " + bx + " " + ny + ")",
                    fill: isHollow ? colors.bg : noteColor,
                    stroke: noteColor, "stroke-width": 1.8
                  }));
                }

                if (beat.dotted) {
                  gNote.appendChild(svgEl("circle", { cx: bx + 10, cy: ny - 1, r: 2, fill: noteColor }));
                }

                if (note.tie) {
                  const nx = bx + beatWidth * 0.85;
                  gNote.appendChild(svgEl("path", {
                    d: "M " + (bx + 5) + " " + (ny + 6) + " Q " + ((bx + nx) / 2) + " " + (ny + 16) + " " + nx + " " + (ny + 6),
                    fill: "none", stroke: noteColor, "stroke-width": 1.5
                  }));
                }

                gNote.addEventListener("pointerdown", function (evt) {
                  evt.stopPropagation();
                  self.dragState = {
                    trackIndex: tIdx, measureIndex: mIdx, beatIndex: bIdx, noteIndex: nIdx,
                    startY: evt.clientY, startMidi: midi, lastDelta: 0
                  };
                });

                self.svg.appendChild(gNote);
              }

              if (showTab && note.string != null && note.fret != null) {
                const sy = tabTopY + note.string * tabGap;
                const label = tech.deadNote ? "X" : tech.harmonic ? ("<" + note.fret + ">") : String(note.fret);

                self.svg.appendChild(svgEl("rect", {
                  x: bx - (label.length > 2 ? 12 : 8), y: sy - 6,
                  width: label.length > 2 ? 24 : 16, height: 12, rx: 2,
                  fill: colors.bg, "pointer-events": "none"
                }));
                self.svg.appendChild(svgEl("text", {
                  x: bx, y: sy + 4, "text-anchor": "middle",
                  fill: tech.deadNote ? colors.rose : tech.harmonic ? colors.blue : colors.ink,
                  "font-size": 11.5, "font-weight": "800",
                  "font-family": "var(--mono, monospace)", "pointer-events": "none"
                }, label));

                if (tech.hammer || tech.pull) {
                  const sym = tech.hammer ? "H" : "P";
                  const nx = bx + beatWidth * 0.78;
                  self.svg.appendChild(svgEl("path", {
                    d: "M " + (bx + 4) + " " + (sy - 7) + " Q " + ((bx + nx) / 2) + " " + (sy - 16) + " " + nx + " " + (sy - 7),
                    fill: "none", stroke: colors.warm, "stroke-width": 1.2, "pointer-events": "none"
                  }));
                  self.svg.appendChild(svgEl("text", {
                    x: (bx + nx) / 2, y: sy - 14, "text-anchor": "middle",
                    fill: colors.warm, "font-size": 9, "font-weight": "800", "pointer-events": "none"
                  }, sym));
                }
                if (tech.slideUp || tech.slideDown) {
                  const y1 = tech.slideUp ? sy + 4 : sy - 4;
                  const y2 = tech.slideUp ? sy - 4 : sy + 4;
                  self.svg.appendChild(svgEl("line", {
                    x1: bx + 9, y1: y1, x2: bx + 24, y2: y2,
                    stroke: colors.warm, "stroke-width": 1.4, "pointer-events": "none"
                  }));
                }
                if (tech.bend) {
                  self.svg.appendChild(svgEl("path", {
                    d: "M " + (bx + 8) + " " + (sy + 2) + " Q " + (bx + 17) + " " + (sy + 2) + " " + (bx + 17) + " " + (sy - 10),
                    fill: "none", stroke: colors.rose, "stroke-width": 1.4, "pointer-events": "none"
                  }));
                  self.svg.appendChild(svgEl("polygon", {
                    points: (bx + 17) + "," + (sy - 13) + " " + (bx + 14) + "," + (sy - 8) + " " + (bx + 20) + "," + (sy - 8),
                    fill: colors.rose, "pointer-events": "none"
                  }));
                  self.svg.appendChild(svgEl("text", {
                    x: bx + 17, y: sy - 15, "text-anchor": "middle",
                    fill: colors.rose, "font-size": 8.5, "font-weight": "800", "pointer-events": "none"
                  }, "Full"));
                }
                if (tech.palmMute) {
                  self.svg.appendChild(svgEl("text", {
                    x: bx, y: tabTopY - 6, "text-anchor": "middle",
                    fill: colors.muted, "font-size": 9, "font-weight": "800", "font-family": "var(--mono, monospace)"
                  }, "P.M."));
                }
                if (tech.vibrato) {
                  self.svg.appendChild(svgEl("text", {
                    x: bx, y: tabTopY - 14, "text-anchor": "middle",
                    fill: colors.blue, "font-size": 11, "font-weight": "900"
                  }, "~~~"));
                }
                if (tech.tap) {
                  self.svg.appendChild(svgEl("text", {
                    x: bx, y: tabTopY - 6, "text-anchor": "middle",
                    fill: colors.accent, "font-size": 9.5, "font-weight": "900"
                  }, "T"));
                }
                if (note.tie && !showStaff) {
                  const nx = bx + beatWidth * 0.85;
                  self.svg.appendChild(svgEl("path", {
                    d: "M " + (bx + 6) + " " + (sy + 6) + " Q " + ((bx + nx) / 2) + " " + (sy + 14) + " " + nx + " " + (sy + 6),
                    fill: "none", stroke: colors.accent, "stroke-width": 1.3
                  }));
                }
              }
            });

            if (showStaff && beat.notes.length && beat.duration >= 2 && highestNoteY < Infinity) {
              const noteColor = isPlayhead ? colors.rose : (track.color || colors.accent);
              const stemX = bx + 5.5;
              const stemTop = highestNoteY - 26;
              self.svg.appendChild(svgEl("line", {
                x1: stemX, y1: lowestNoteY, x2: stemX, y2: stemTop,
                stroke: noteColor, "stroke-width": 1.5, "pointer-events": "none"
              }));

              if (beat.duration >= 8) {
                beamCoords.push({ x: stemX, y: stemTop, dur: beat.duration, color: noteColor, bIdx: bIdx });
              }
            }

            if (showTab && beat.notes.length) {
              const ryTop = tabTopY + tabHeight + 6;
              const ryBot = ryTop + 14;
              const stemColor = isPlayhead ? colors.rose : colors.muted;
              if (beat.duration >= 2) {
                self.svg.appendChild(svgEl("line", {
                  x1: bx, y1: beat.duration === 2 ? ryTop + 5 : ryTop, x2: bx, y2: ryBot,
                  stroke: stemColor, "stroke-width": 1.3
                }));
              }
              if (beat.duration >= 8) {
                self.svg.appendChild(svgEl("line", {
                  x1: bx, y1: ryBot, x2: bx + 8, y2: ryBot - 3,
                  stroke: stemColor, "stroke-width": 1.6
                }));
              }
              if (beat.duration >= 16) {
                self.svg.appendChild(svgEl("line", {
                  x1: bx, y1: ryBot - 4, x2: bx + 8, y2: ryBot - 7,
                  stroke: stemColor, "stroke-width": 1.6
                }));
              }
              if (beat.dotted) {
                self.svg.appendChild(svgEl("circle", { cx: bx + 6, cy: ryBot - 1, r: 1.6, fill: stemColor }));
              }
            }
          });

          for (let i = 0; i < beamCoords.length; i++) {
            const cur = beamCoords[i];
            const next = beamCoords[i + 1];
            if (next && next.bIdx === cur.bIdx + 1) {
              const beamY = Math.min(cur.y, next.y);
              self.svg.appendChild(svgEl("line", {
                x1: cur.x, y1: beamY, x2: next.x, y2: beamY,
                stroke: cur.color, "stroke-width": 3.4
              }));
              if (cur.dur === 16 && next.dur === 16) {
                self.svg.appendChild(svgEl("line", {
                  x1: cur.x, y1: beamY + 5, x2: next.x, y2: beamY + 5,
                  stroke: cur.color, "stroke-width": 2.8
                }));
              }
              self.svg.appendChild(svgEl("line", { x1: cur.x, y1: cur.y, x2: cur.x, y2: beamY, stroke: cur.color, "stroke-width": 1.5 }));
              self.svg.appendChild(svgEl("line", { x1: next.x, y1: next.y, x2: next.x, y2: beamY, stroke: next.color, "stroke-width": 1.5 }));
            } else if (i === 0 || beamCoords[i - 1].bIdx !== cur.bIdx - 1) {
              self.svg.appendChild(svgEl("path", {
                d: "M " + cur.x + " " + cur.y + " q 8 5 6 13",
                fill: "none", stroke: cur.color, "stroke-width": 1.6
              }));
              if (cur.dur === 16) {
                self.svg.appendChild(svgEl("path", {
                  d: "M " + cur.x + " " + (cur.y + 5) + " q 8 5 6 13",
                  fill: "none", stroke: cur.color, "stroke-width": 1.6
                }));
              }
            }
          }
        });

        currentY = trackBottomY + (showTab ? 28 : 10) + trackGap;
      });

      const finalH = Math.max(currentY + 24, 380);
      this.svg.setAttribute("width", String(totalWidth));
      this.svg.setAttribute("height", String(finalH));
      this.svg.setAttribute("viewBox", "0 0 " + totalWidth + " " + finalH);
      this.svg.style.width = totalWidth + "px";
      this.svg.style.height = finalH + "px";
    }
  }

  NS.GPScoreRenderer = GPScoreRenderer;
})(window);
