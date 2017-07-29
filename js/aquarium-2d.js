'use strict';

function draw_logic(){
    // Save the current buffer state.
    canvas_buffer.save();
    canvas_buffer.translate(
      -camera_x,
      0
    );

    canvas_buffer.fillStyle = '#003';
    core_group_modify({
      'groups': [
        'pillar',
      ],
      'todo': function(entity){
          canvas_buffer.fillRect(
            core_entities[entity]['x'],
            0,
            100,
            canvas_height
          );
      },
    });

    // Draw stuff relative to center of canvas.
    canvas_buffer.translate(
      0,
      -camera_y
    );

    core_group_modify({
      'groups': [
        'fish',
      ],
      'todo': function(entity){
          canvas_buffer.save();

          // Translate and rotate fish.
          canvas_buffer.translate(
            core_entities[entity]['x'],
            core_entities[entity]['y']
          );
          canvas_buffer.rotate(core_entities[entity]['angle']);

          // Determine movement direction based on dx.
          var direction = core_entities[entity]['dx'] > 0
            ? 1
            : -1;

          // Draw fish.
          canvas_draw_path({
            'properties': {
              'fillStyle': core_entities[entity]['color'],
            },
            'vertices': [
              {
                'type': 'moveTo',
                'y': core_entities[entity]['size'] / 2,
              },
              {
                'x': core_entities[entity]['size'] * direction,
              },
              {
                'x': core_entities[entity]['size'] * 3 * direction,
                'y': core_entities[entity]['size'],
              },
              {
                'x': core_entities[entity]['size'] * 3 * direction,
              },
              {
                'x': core_entities[entity]['size'] * direction,
                'y': core_entities[entity]['size'],
              },
            ],
          });

          canvas_buffer.restore();
      },
    });

    // Restore the buffer state.
    canvas_buffer.restore();
}

function logic(){
    if(core_keys[65]['state']){
        camera_x -= core_storage_data['camera-speed'];
    }
    if(core_keys[68]['state']){
        camera_x += core_storage_data['camera-speed'];
    }
    if(core_keys[83]['state']){
        camera_y += core_storage_data['camera-speed'];
    }
    if(core_keys[87]['state']){
        camera_y -= core_storage_data['camera-speed'];
    }

    core_group_modify({
      'groups': [
        'fish',
      ],
      'todo': function(entity){
          // Fish move in the direction they are facing.
          core_entities[entity]['x'] -= core_entities[entity]['dx'];
          core_entities[entity]['y'] -= core_entities[entity]['dy'];

          // If a fish travels past the edge of the screen,
          //   move it to the other side.
          var size = core_entities[entity]['size'] * 4;
          if(core_entities[entity]['x'] > camera_x + canvas_width + size
            || core_entities[entity]['x'] < camera_x - size){
              core_entities[entity]['x'] += core_entities[entity]['dx'] < 0
                ? -canvas_width - size
                : canvas_width + size;
              core_entities[entity]['y'] = camera_y + core_random_integer({
                'max': canvas_height,
              });

              randomize_fish_movement(entity);
          }
      },
    });

    core_ui_update({
      'ids': {
        //'fish': core_groups['fish'].length,
        'x': camera_x,
        'y': camera_y,
      },
    });
}

function repo_init(){
    core_repo_init({
      'entities': {
        'fish': {
          'properties': {
            'angle': 0,
            'dx': 0,
            'dy': 0,
          },
        },
        'pillar': {},
      },
      'info': '<input onclick=canvas_setmode({newgame:true}) type=button value=Restart>',
      'keybinds': {
        16: {},
        65: {},
        68: {},
        70: {
          'todo': create_fish,
        },
        72: {
          'todo': function(){
              camera_x = 0;
              camera_y = 0;
          },
        },
        83: {},
        87: {},
      },
      'storage': {
        'camera-speed': 5,
      },
      'storage-menu': '<table><tr><td><input id=camera-speed><td>Camera Speed</table>',
      'title': 'Aquarium-2D.htm',
      'ui': '<span id=ui-fish></span> Fish<br><span id=ui-x></span>x, <span id=ui-y></span>y',
    });
    canvas_init();
}

var camera_x = 0;
var camera_y = 0;
