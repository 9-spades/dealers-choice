import { StyleSheet, Text, Platform } from 'react-native';

const font = Platform.OS === 'web' ? 'monospace' : 'Menlo';

export function JsonContent({ obj, indent = 0, style = 'light' }) {
  const space = '  '.repeat(indent);
  const theme = themes[style];
  if (obj === null) return <Text style={theme.boolean}>null</Text>;
  if (typeof obj === 'boolean')
    return <Text style={theme.boolean}>{obj.toString()}</Text>;
  if (typeof obj === 'number')
    return <Text style={theme.number}>{obj.toString()}</Text>;
  if (typeof obj === 'string')
    return <Text style={theme.string}>&quot;{obj}&quot;</Text>;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return <Text style={theme.bracket}>{'[]'}</Text>;
    return (
      <Text style={theme.bracket}>
        {'['}
        {obj.map((item, i) => (
          <Text key={i}>
            {'\n  ' + space}
            <JsonContent obj={item} indent={indent + 1} style={style} />
            {i < obj.length - 1 && ','}
          </Text>
        ))}
        {'\n' + space + ']'}
      </Text>
    );
  }
  const keys = Object.keys(obj);
  if (keys.length === 0) return <Text style={theme.bracket}>{'{}'}</Text>;
  return (
    <Text style={theme.bracket}>
      {'{'}
      {keys.map((key, i) => (
        <Text key={i}>
          {'\n  ' + space}
          <Text style={theme.key}>&quot;{key}&quot;</Text>
          {': '}
          <JsonContent obj={obj[key]} indent={indent + 1} style={style} />
          {i < keys.length - 1 && ','}
        </Text>
      ))}
      {'\n' + space + '}'}
    </Text>
  );
}

const themes = StyleSheet.create({
  dark: {
    text: {
      color: '#22D3EE',
      fontFamily: font
    },
    string: {
      color: '#4ADE80',
      fontFamily: font
    },
    number: {
      color: '#60A5FA',
      fontFamily: font
    },
    boolean: {
      color: '#A78BFA',
      fontFamily: font
    },
    key: {
      color: '#67E8F9',
      fontFamily: font
    },
    bracket: {
      color: '#D1D5DB',
      fontFamily: font
    }
  },
  light: {
    text: {
      color: '#1F2937',
      fontFamily: font
    },
    string: {
      color: '#059669',
      fontFamily: font
    },
    number: {
      color: '#2563EB',
      fontFamily: font
    },
    boolean: {
      color: '#7C3AED',
      fontFamily: font
    },
    key: {
      color: '#374151',
      fontFamily: font
    },
    bracket: {
      color: '#6B7280',
      fontFamily: font
    }
  },
  cyberpunk: {
    text: {
      color: '#67E8F9',
      fontFamily: font
    },
    string: {
      color: '#F472B6',
      fontFamily: font
    },
    number: {
      color: '#FBBF24',
      fontFamily: font
    },
    boolean: {
      color: '#4ADE80',
      fontFamily: font
    },
    key: {
      color: '#A5F3FC',
      fontFamily: font
    },
    bracket: {
      color: '#FFFFFF',
      fontFamily: font
    }
  }
});
